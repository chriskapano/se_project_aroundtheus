export default class Card {
  constructor(
    data,
    cardSelector,
    handleImageClick,
    handleDeleteCard,
    handleLikeToggle,
    userId
  ) {
    this._name = data.name;
    this._link = data.link;
    this._id = data._id;
    this._likes = data.likes;
    this._userId = userId;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleDeleteCard = handleDeleteCard;
    this._handleLikeToggle = handleLikeToggle;
  }

  _isLikedbyUser() {
    return this._likes.some((like) => like._id === this._userId);
  }

  _updateLikeStatus() {
    const likeButton = this._cardElement.querySelector(".card__like-button");

    if (this._isLikedbyUser()) {
      likeButton.classList.add("card__like-button_active");
    } else {
      likeButton.classList.remove("card__like-button_active");
    }
  }

  _setEventListeners() {
    this._cardElement
      .querySelector(".card__like-button")
      .addEventListener("click", () => {
        this._handleLikeToggle(this._id, this._isLikedbyUser());
      });

    this._cardElement
      .querySelector(".card__delete-button")
      .addEventListener("click", () => {
        this._handleDeleteCard(this._id);
      });

    this._cardElement
      .querySelector(".card__image")
      .addEventListener("click", () => {
        this._handleImageClick({ name: this._name, link: this._link });
      });
  }

  deleteCard() {
    this._cardElement.remove();
    this._cardElement = null;
  }

  updateLikes(newLikes) {
    this._likes = newLikes;
    this._updateLikeStatus();
  }

  getView() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    this._cardElement.querySelector(".card__title").textContent = this._name;
    this._cardElement.querySelector(".card__image").src = this._link;
    this._cardElement.querySelector(".card__image").alt = this._name;

    this._updateLikeStatus();

    this._setEventListeners();

    return this._cardElement;
  }
}
