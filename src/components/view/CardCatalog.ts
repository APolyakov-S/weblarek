import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import { setCategoryStyle } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';
import { TCardCatalogActions, ICardCatalog } from '../../types';
import { CardBase } from './CardBase';

export class CardCatalog extends CardBase<ICardCatalog> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;

  constructor(container: HTMLElement, actions: TCardCatalogActions) {
    super(container);

    this.cardCategory = ensureElement<HTMLElement>(
      '.card__category',
      this.container,
    );
    this.cardImage = ensureElement<HTMLImageElement>(
      '.card__image',
      this.container,
    );

    this.container.addEventListener('click', actions.onSelect);
  }

  set category(value: string) {
    setCategoryStyle(this.cardCategory, value, categoryMap);
  }

  set image(value: string) {
    const imagePath = value.replace('.svg', '.png');
    this.cardImage.src = `${CDN_URL}${imagePath}`;
  }
}