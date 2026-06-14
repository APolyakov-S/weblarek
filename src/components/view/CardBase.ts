import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { ICardBase } from '../../types';

export abstract class CardBase<T> extends Component<T & ICardBase> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
    this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set title(value: string) {
    this.cardTitle.textContent = value;
  }

  set price(value: number | null) {
    this.cardPrice.textContent =
      value === null ? `Бесценно` : `${value} синапсов`;
  }
}