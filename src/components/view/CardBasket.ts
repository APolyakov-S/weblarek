import { ensureElement } from '../../utils/utils';
import { TCardBasketActions, ICardBasket } from '../../types';
import { CardBase } from './CardBase';

export class CardBasket extends CardBase<ICardBasket> {
  protected cardIndex: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: TCardBasketActions) {
    super(container);

    this.cardIndex = ensureElement<HTMLElement>(
      '.basket__item-index',
      this.container,
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      '.basket__item-delete',
      this.container,
    );

    this.deleteButton.addEventListener('click', actions.onDelete);
  }

  set index(value: number) {
    this.cardIndex.textContent = String(value);
  }
}