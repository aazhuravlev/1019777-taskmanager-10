import AbstractComponent from './abstract-component.js';

export default class AbstractSmartComponent extends AbstractComponent {
  recoverListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.clearElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this.recoverListeners();
  }
}
