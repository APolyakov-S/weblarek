import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { IBasket } from "../../types";

export class Basket extends Component<IBasket> {
  protected basketList: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected basketPrice: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:submit');
    });
  }

  set items(value: HTMLElement[]) {
    this.basketList.replaceChildren(...value);
  }

  set total(value: number) {
    this.basketPrice.textContent = `${value} синапсов`;
  }

  set buttonDisabled(value: boolean) {
    this.basketButton.disabled = value;
  }
}