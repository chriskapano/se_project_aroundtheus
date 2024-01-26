export default class FormValidator {
  constructor(settings, formElement) {
    this._settings = settings;
    this._formElement = formElement;
    this._submitButton = this._formElement.querySelector(
      settings.submitButtonSelector
    );

    this._handleInput = this._handleInput.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleInput(event) {
    const inputElement = event.target;
    const options = this._settings;
    this._checkInputValidity(inputElement, options);
    this._toggleButtonState();
  }

  _handleSubmit(event) {
    event.preventDefault();
  }

  _addHandlers() {
    this._formElement.addEventListener("submit", this._handleSubmit);

    const inputElements = [
      ...this._formElement.querySelectorAll(this._settings.inputSelector),
    ];

    inputElements.forEach((inputElement) => {
      inputElement.addEventListener("input", this._handleInput);
    });
  }

  _checkInputValidity(inputElement, options) {
    if (!inputElement.validity.valid) {
      this._showInputError(inputElement, options);
      return false;
    }

    this._hideInputError(inputElement, options);
    return true;
  }

  _showInputError(inputElement, { inputErrorClass, errorClass }) {
    const errorMessageElement = this._formElement.querySelector(
      `#${inputElement.id}-error`
    );
    inputElement.classList.add(inputErrorClass);
    errorMessageElement.textContent = inputElement.validationMessage;
    errorMessageElement.classList.add(errorClass);
  }

  _hideInputError(inputElement, { inputErrorClass, errorClass }) {
    const errorMessageElement = this._formElement.querySelector(
      `#${inputElement.id}-error`
    );
    inputElement.classList.remove(inputErrorClass);
    errorMessageElement.textContent = "";
    errorMessageElement.classList.remove(errorClass);
  }

  _hasInvalidInput() {
    const inputElements = [
      ...this._formElement.querySelectorAll(this._settings.inputSelector),
    ];
    return !inputElements.every((inputElement) =>
      this._checkInputValidity(inputElement, this._settings)
    );
  }

  _toggleButtonState() {
    if (this._hasInvalidInput()) {
      this.disableButton();
      return;
    }

    this._enableButton();
  }

  disableButton() {
    this._submitButton.classList.add(this._settings.inactiveButtonClass);
    this._submitButton.disabled = true;
  }

  _enableButton() {
    this._submitButton.classList.remove(this._settings.inactiveButtonClass);
    this._submitButton.disabled = false;
  }

  enableValidation() {
    this._addHandlers();
  }

  resetValidation() {
    const inputElements = [
      ...this._formElement.querySelectorAll(this._settings.inputSelector),
    ];

    inputElements.forEach((inputElement) => {
      this._hideInputError(inputElement, this._settings);
    });

    this._enableButton();
  }
}
