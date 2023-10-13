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

const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;

// WRAPPERS
const cardsWrap = document.querySelector(".cards__list");
const profileEditModal = document.querySelector("#profile-edit-modal");
const addCardModal = document.querySelector("#add-card-modal");
const previewImageModal = document.querySelector("#preview-image-modal");
const profileEditForm = profileEditModal.querySelector(".modal__form");
const addCardFormElement = addCardModal.querySelector(".modal__form");

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

function closePopup(modal) {
  modal.classList.remove("modal_opened");
}

function openPopup(modal) {
  modal.classList.add("modal_opened");
}

function renderCard(cardData, wrapper) {
  const cardElement = getCardElement(cardData);
  wrapper.prepend(cardElement);
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
}

function handleLikeButton(evt) {
  evt.target.classList.toggle("card__like-button_active");
}

function handleDeleteCard(evt) {
  evt.target.closest(".card").remove();
}

function handlePreviewImage(data) {
  imagePopUp.src = data.link;
  imagePopUp.alt = `${data.name}`;
  imageCaption.textContent = data.name;
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
  cardImageEl.addEventListener("click", () => handlePreviewImage(data));

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

// add new card
addNewCardButton.addEventListener("click", () => openPopup(addCardModal));

addCardModalCloseButton.addEventListener("click", () =>
  closePopup(addCardModal)
);

// image preview

previewImageCloseButton.addEventListener("click", () =>
  closePopup(previewImageModal)
);

initialCards.forEach((cardData) => renderCard(cardData, cardsWrap));
