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
const profileEditForm = profileEditModal.querySelector(".modal__form");
const addCardFormElement = addCardModal.querySelector(".modal__form");
const deleteButton = document.querySelector(".card__delete-button");

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

function handleAvatarEditSubmit(e, formValue) {
  e.preventDefault();

  editCardPopup.setLoadingState(false);

  const { link } = formValue;
  api
    .updateUserAvatar(link)
    .then()
    .catch((err) => console.error(err))
    .finally(() => {
      editCardPopup.setLoadingState(true);
    });
}

function handleDeleteCard(cardInstance, cardId) {
  deleteCardPopup.open();

  deleteCardPopup.setSubmitAction(() => {
    if (!cardId) {
      console.error("Card ID is undefined or missing. Unable to delete card.");
      return;
    }
    console.log(`Deleting card with ID: ${cardId}`);

    api
      .deleteCard(cardId)
      .then(() => {
        console.log(`Successfully deleted card with ID: ${cardId}`);
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
  editAvatarPopup.open();
});

editAvatarButtonPencil.addEventListener("click", () => {
  editAvatarPopup.open();
});
