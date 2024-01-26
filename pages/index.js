import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";

const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
  },
];

// WRAPPERS
const cardsWrap = document.querySelector(".cards__list");
const profileEditModal = document.querySelector("#profile-edit-modal");
const addCardModal = document.querySelector("#add-card-modal");
const previewImageModal = document.querySelector("#preview-image-modal");
const profileEditForm = profileEditModal.querySelector(".modal__form");
const addCardFormElement = addCardModal.querySelector(".modal__form");

// Import from Card
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

const cardSelector = "#card-template";

initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData);
  cardsWrap.appendChild(cardElement);
});

function createCard(cardData) {
  const card = new Card(cardData, cardSelector, () =>
    handlePreviewImage(cardData)
  );
  return card.getView();
}

// Import from FormValidator
const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const profileEditFormElement = document.getElementById("profile-edit-modal");
const profileEditFormValidator = new FormValidator(
  settings,
  profileEditFormElement
);
profileEditFormValidator.enableValidation();

const addCardFormElementId = document.getElementById("add-card-modal");
const addCardFormValidator = new FormValidator(settings, addCardFormElementId);
addCardFormValidator.enableValidation();

// Buttons and other DOM nodes
const profileEditButton = document.querySelector(".profile__edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");
const profileEditCloseButton = profileEditModal.querySelector(".modal__close");
const addCardModalCloseButton = addCardModal.querySelector(".modal__close");
const previewImageCloseButton =
  previewImageModal.querySelector(".modal__close");

// Profile DOM nodes
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// FORM DATA
const profileTitleInput = profileEditForm.querySelector(".modal__input_name");
const profileDescriptionInput = profileEditForm.querySelector(
  ".modal__input_description"
);
const cardTitleInput = addCardFormElement.querySelector(".modal__input_title");
const cardLinkInput = addCardFormElement.querySelector(".modal__input_link");
const imagePopUp = previewImageModal.querySelector(".modal__image");
const imageCaption = previewImageModal.querySelector(".modal__caption");

// FUNCTIONS

function isOverlayClicked(event) {
  return event.target === event.currentTarget;
}

function closeOnOverlayClick(modal, event) {
  if (isOverlayClicked(event)) {
    closePopup(modal);
  }
}

function isEscEvent(evt, action, modal) {
  if (evt.key === "Escape") {
    action(modal);
  }
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const modalOpened = document.querySelector(".modal_opened");
    if (modalOpened) {
      closePopup(modalOpened);
    }
  }
}

function closePopup(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

function openPopup(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

function renderCard(cardData, wrapper) {
  const card = new Card(cardData, cardSelector, handlePreviewImage);
  wrapper.prepend(card.getView());
}

function handleProfileEditSubmit(e) {
  e.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopup(profileEditModal);
}

function handleAddCardFormSubmit(e) {
  e.preventDefault();
  const name = cardTitleInput.value;
  const link = cardLinkInput.value;
  renderCard({ name, link }, cardsWrap);
  closePopup(addCardModal);
  e.target.reset();
}

function handlePreviewImage({ name, link }) {
  imagePopUp.src = link;
  imagePopUp.alt = name;
  imageCaption.textContent = name;
  openPopup(previewImageModal);
}

function getCardElement(cardData) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardTitleEl.textContent = cardData.name;
  cardImageEl.alt = cardData.name;
  cardImageEl.src = cardData.link;

  likeButton.addEventListener("click", handleLikeButton);
  deleteButton.addEventListener("click", handleDeleteCard);
  cardImageEl.addEventListener("click", () => handlePreviewImage(cardData));

  return cardElement;
}

// EVENT LISTENERS

profileEditForm.addEventListener("submit", handleProfileEditSubmit);
addCardFormElement.addEventListener("submit", handleAddCardFormSubmit);

profileEditButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openPopup(profileEditModal);
});
profileEditCloseButton.addEventListener("click", () =>
  closePopup(profileEditModal)
);

profileEditModal.addEventListener("click", (event) =>
  closeOnOverlayClick(profileEditModal, event)
);
addCardModal.addEventListener("click", (event) =>
  closeOnOverlayClick(addCardModal, event)
);
previewImageModal.addEventListener("click", (event) =>
  closeOnOverlayClick(previewImageModal, event)
);

// add new card
addNewCardButton.addEventListener("click", () => {
  // add disableButton
  addCardFormValidator.disableButton();
  openPopup(addCardModal);
});

addCardModalCloseButton.addEventListener("click", () =>
  closePopup(addCardModal)
);

// image preview

previewImageCloseButton.addEventListener("click", () =>
  closePopup(previewImageModal)
);
