import Popup from "./Popup.js";

class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super({ popupSelector });
    this._popupForm = this._popupElement.querySelector(".modal__form");
    this._handleFormSubmit = handleFormSubmit;
    this._submitButton = this._popupForm.querySelector(".modal__button");
    this._defaultButtonText = this._submitButton.textContent;
  }

  _getInputValues() {
    this._inputList = this._popupForm.querySelectorAll(".modal__input");
    this._formValues = {};

    this._inputList.forEach((input) => {
      this._formValues[input.name] = input.value;
    });

    return this._formValues;
  }

  setLoadingState(isLoading) {
    if (this._submitButton) {
      this._submitButton.textContent = isLoading
        ? this._defaultButtonText
        : "Saving...";
    }
  }

  setEventListeners() {
    this._popupForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._handleFormSubmit(evt, this._getInputValues());
      this._popupForm.reset();
    });

    super.setEventListeners();
  }

  setSubmitAction(action) {
    this._handleFormSubmit = action;
  }
}

export default PopupWithForm;
