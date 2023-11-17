export default class FormValidator {
  constructor(settings, formElement) {
    this._settings = settings;
    this._formElement = formElement;

    this._handleInput = this._handleInput.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);

    this._addHandlers();
  }

  _handleInput(event) {
    const inputElement = event.target;
    const options = this._settings;
    checkInputValidity(this._formElement, inputElement, options);
    toggleButtonState(
      [...this._formElement.querySelectorAll(options.inputSelector)],
      this._formElement.querySelector(options.submitButtonSelector),
      options
    );
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

  enableValidation() {
    this._addHandlers();
  }

  disableValidation() {
    this._formElement.removeEventListener("submit", this._handleSubmit);

    const inputElements = [
      ...this._formElement.querySelectorAll(this._settings.inputSelector),
    ];

    inputElements.forEach((inputElement) => {
      inputElement.removeEventListener("input", this._handleInput);
    });
  }

  resetValidation() {}
}
