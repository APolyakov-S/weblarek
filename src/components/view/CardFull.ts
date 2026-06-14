import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import { setCategoryStyle } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';
import { TCardFullActions, ICardFull } from '../../types';
import { CardBase } from './CardBase';

export class CardFull extends CardBase<ICardFull> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected cardDescription: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: TCardFullActions) {
    super(container);

    this.cardCategory = ensureElement<HTMLElement>(
      '.card__category',
      this.container,
    );
    this.cardImage = ensureElement<HTMLImageElement>(
      '.card__image',
      this.container,
    );
    this.cardDescription = ensureElement<HTMLElement>(
      '.card__text',
      this.container,
    );
    this.cardButton = ensureElement<HTMLButtonElement>(
      '.card__button',
      this.container,
    );

    this.cardButton.addEventListener('click', actions.onButtonClick);
  }

  set category(value: string) {
    setCategoryStyle(this.cardCategory, value, categoryMap);
  }

  set description(value: string) {
    this.cardDescription.textContent = value;
  }

  set image(value: string) {
    const imagePath = value.replace('.svg', '.png');
    this.cardImage.src = `${CDN_URL}${imagePath}`;
  }

  set buttonText(value: string) {
    this.cardButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.cardButton.disabled = value;
  }
}