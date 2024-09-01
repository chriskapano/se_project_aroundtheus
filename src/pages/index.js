import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import "./index.css";
import { initialCards, settings } from "../utils.js";

// WRAPPERS
const cardsWrap = document.querySelector(".cards__list");
const profileEditModal = document.querySelector("#profile-edit-modal");
const addCardModal = document.querySelector("#add-card-modal");
const previewImageModal = document.querySelector("#preview-image-modal");
const profileEditForm = profileEditModal.querySelector(".modal__form");
const addCardFormElement = addCardModal.querySelector(".modal__form");

// Import from Card
const cardSelector = "#card-template";

function createCard(cardData) {
  const card = new Card(cardData, cardSelector, () =>
    handlePreviewImage(cardData)
  );
  return card.getView();
}

const cardSection = new Section(
  {
    items: initialCards,
    renderer: (item) => {
      const cardElement = createCard(item);
      cardSection.addItem(cardElement);
    },
  },
  ".cards__list"
);

cardSection.renderItems();

// Import from FormValidator

const profileEditFormValidator = new FormValidator(settings, profileEditForm);
profileEditFormValidator.enableValidation();

const addCardFormValidator = new FormValidator(settings, addCardFormElement);
addCardFormValidator.enableValidation();

// Import from PopupWithForm

const newCardPopup = new PopupWithForm(
  "#add-card-modal",
  handleAddCardFormSubmit
);
newCardPopup.setEventListeners();

const editCardPopup = new PopupWithForm(
  "#profile-edit-modal",
  handleAddCardFormSubmit
);
editCardPopup.setEventListeners();

// Import from PopupWithImage

const imagePopUp = new PopupWithImage("#preview-image-modal");
imagePopUp.setEventListeners();

// Profile DOM nodes
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// Import from UserInfo

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
});

// Buttons and other DOM nodes
const profileEditButton = document.querySelector(".profile__edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");
const profileEditCloseButton = profileEditModal.querySelector(".modal__close");
const addCardModalCloseButton = addCardModal.querySelector(".modal__close");
const previewImageCloseButton =
  previewImageModal.querySelector(".modal__close");

// FORM DATA
const profileTitleInput = profileEditForm.querySelector(".modal__input_name");
const profileDescriptionInput = profileEditForm.querySelector(
  ".modal__input_description"
);
const cardTitleInput = addCardFormElement.querySelector(".modal__input_title");
const cardLinkInput = addCardFormElement.querySelector(".modal__input_link");

// FUNCTIONS

function isOverlayClicked(event) {
  return event.target === event.currentTarget;
}

function closeOnOverlayClick(modal, event) {
  if (isOverlayClicked(event)) {
    closePopup(modal);
  }
}

function renderCard(cardData) {
  const cardElement = createCard(cardData);
  cardSection.addItem(cardElement);
}

function handleProfileEditSubmit(e) {
  e.preventDefault();
  userInfo.setUserInfo({
    name: profileTitleInput.value,
    job: profileDescriptionInput.value,
  });
  closePopup(profileEditModal);
}

function handleAddCardFormSubmit(e, formValues) {
  e.preventDefault();
  // const name = cardTitleInput.value;
  // const link = cardLinkInput.value;
  const { name, link } = formValues;
  const newCardData = { name, link };

  cardSection.addItem(createCard(newCardData));

  // closePopup(addCardModal);
  newCardPopup.close();
  e.target.reset();
  addCardFormValidator.disableButton();
}

function handlePreviewImage(cardData) {
  imagePopUp.open(cardData);
}

// EVENT LISTENERS

profileEditButton.addEventListener("click", () => {
  const userInfoData = userInfo.getUserInfo();
  profileTitleInput.value = userInfoData.name;
  profileDescriptionInput.value = userInfoData.job;
  editCardPopup.open();
});

// add new card
addNewCardButton.addEventListener("click", () => {
  newCardPopup.open();
});
