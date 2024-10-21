import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import "./index.css";
import { settings } from "../utils.js";
import Api from "../components/Api.js";

// WRAPPERS
const profileEditModal = document.querySelector("#profile-edit-modal");
const addCardModal = document.querySelector("#add-card-modal");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const profileEditForm = profileEditModal.querySelector(".modal__form");
const addCardFormElement = addCardModal.querySelector(".modal__form");
const editAvatarForm = editAvatarModal.querySelector(".modal__form");

// Import from Api
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "3e30a101-1104-4b9d-af70-47714cfc57be",
    "Content-Type": "application/json",
  },
});

// Fetch and use user info
api.getUserInfo().then((userData) => {
  userInfo.setUserInfo({ name: userData.name, job: userData.about });
  document.querySelector(".profile__image").src = userData.avatar;
});

// Fetch and use initial cards
api.getInitialCards().then((cardsData) => {
  cardSection.renderItems(cardsData);
});

// Import from Card
const cardSelector = "#card-template";

function createCard(cardData) {
  const card = new Card(
    cardData,
    cardSelector,
    () => handlePreviewImage(cardData),
    (cardId) => handleDeleteCard(card, cardId),
    (card, cardId, isLiked) => handleLikeToggle(card, cardId, isLiked)
  );
  return card.getView();
}

// Render Cards Section
const cardSection = new Section(
  {
    items: [],
    renderer: (item) => {
      const cardElement = createCard(item);
      cardSection.addItem(cardElement);
    },
  },
  ".cards__list"
);

api
  .getAppInfo()
  .then(([userData, cardsData]) => {
    userInfo.setUserInfo({ name: userData.name, job: userData.about });
    cardSection.renderItems(cardsData);
  })
  .catch((err) => {
    console.error(err);
  });

// Import from FormValidator

const profileEditFormValidator = new FormValidator(settings, profileEditForm);
profileEditFormValidator.enableValidation();

const addCardFormValidator = new FormValidator(settings, addCardFormElement);
addCardFormValidator.enableValidation();

const avatarFormValidator = new FormValidator(settings, editAvatarForm);
avatarFormValidator.enableValidation();

// Import from PopupWithForm

const newCardPopup = new PopupWithForm(
  "#add-card-modal",
  handleAddCardFormSubmit
);
newCardPopup.setEventListeners();

const editCardPopup = new PopupWithForm(
  "#profile-edit-modal",
  handleProfileEditSubmit
);
editCardPopup.setEventListeners();

const editAvatarPopup = new PopupWithForm(
  "#edit-avatar-modal",
  handleAvatarEditSubmit
);
editAvatarPopup.setEventListeners();

const deleteCardPopup = new PopupWithForm("#delete-card-modal", () => {});
deleteCardPopup.setEventListeners();

// Import from PopupWithImage

const imagePopUp = new PopupWithImage("#preview-image-modal");
imagePopUp.setEventListeners();

// Import from UserInfo

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
  avatarSelector: ".profile__image",
});

// Buttons and other DOM nodes
const profileEditButton = document.querySelector(".profile__edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");
const editAvatarButton = document.querySelector(".profile__image");
const editAvatarButtonPencil = document.querySelector(".profile__pencil");

// FORM DATA
const profileTitleInput = profileEditForm.querySelector(".modal__input_name");
const profileDescriptionInput = profileEditForm.querySelector(
  ".modal__input_description"
);

// FUNCTIONS

function handleAvatarEditSubmit(e, formValues) {
  e.preventDefault();

  const { avatar } = formValues;
  console.log("Avatar URL being sent:", avatar);

  editAvatarPopup.setLoadingState(false);

  api
    .updateUserAvatar(avatar)
    .then(() => {
      return api.getUserInfo();
    })
    .then((userData) => {
      document.querySelector(".profile__image").src = userData.avatar;
      editAvatarPopup.close();
    })
    .catch((err) => console.error("Error in API call:", err))
    .finally(() => {
      editAvatarPopup.setLoadingState(true);
    });
}

function handleProfileEditSubmit(e, formValues) {
  e.preventDefault();

  editCardPopup.setLoadingState(false);

  api
    .updateUserProfile(formValues.name, formValues.description)
    .then((updatedUserData) => {
      userInfo.setUserInfo({
        name: updatedUserData.name,
        job: updatedUserData.about,
      });
      editCardPopup.close();
    })
    .catch((err) => console.error(err))
    .finally(() => {
      editCardPopup.setLoadingState(true);
    });
}

function handleAddCardFormSubmit(e, formValues) {
  e.preventDefault();
  editCardPopup.setLoadingState(false);
  const { title, link } = formValues;

  api
    .addCard(title, link)
    .then((newCard) => {
      cardSection.addItem(createCard(newCard));
      newCardPopup.close();
      e.target.reset();
      addCardFormValidator.disableButton();
    })
    .catch((err) => console.error(err))
    .finally(() => {
      editCardPopup.setLoadingState(true);
    });
}

function handleDeleteCard(cardInstance, cardId) {
  deleteCardPopup.open();

  deleteCardPopup.setSubmitAction(() => {
    api
      .deleteCard(cardId)
      .then(() => {
        cardInstance.deleteCard();
        deleteCardPopup.close();
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

function handlePreviewImage(cardData) {
  imagePopUp.open(cardData);
}

function handleLikeToggle(cardInstance, cardId, isLiked) {
  if (isLiked) {
    api
      .removeLike(cardId)
      .then((updatedCardData) => {
        cardInstance.updateLikes(updatedCardData.likes);
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    api
      .addLike(cardId)
      .then((updatedCardData) => {
        cardInstance.updateLikes(updatedCardData.likes);
      })
      .catch((err) => {
        console.error(err);
      });
  }
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

// edit avatar pop up
editAvatarButton.addEventListener("click", () => {
  const currentAvatar = document.querySelector(".profile__image").src;
  document.querySelector("#edit-avatar-link-input").value = currentAvatar;
  editAvatarPopup.open();
});

editAvatarButtonPencil.addEventListener("click", () => {
  const currentAvatar = document.querySelector(".profile__image").src;
  document.querySelector("#edit-avatar-link-input").value = currentAvatar;
  editAvatarPopup.open();
});

editAvatarForm.addEventListener("submit", (e) => {
  const formValues = editAvatarPopup._getInputValues();
  handleAvatarEditSubmit(e, formValues);
});
