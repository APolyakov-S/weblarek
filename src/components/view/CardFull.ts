import { CardBase } from './CardBase';
import { ensureElement } from '../../utils/utils';
import { ICardFull, TCardFullActions } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { setCategoryStyle } from '../../utils/utils';

export class CardFull extends CardBase<ICardFull> {
    private categoryElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private descriptionElement: HTMLElement;
    private buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: TCardFullActions) {
        super(container);
        
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);
        
        if (actions?.onButtonClick) {
            this.buttonElement.addEventListener('click', () => {
                actions.onButtonClick();
            });
        }
    }

    set category(value: string) {
        setCategoryStyle(this.categoryElement, value, categoryMap);
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set image(value: string) {
        const fullUrl = value.startsWith('http') ? value : CDN_URL + value;
        this.imageElement.src = fullUrl;
        this.imageElement.alt = this.title || 'Товар';
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        if (value) {
            this.buttonElement.setAttribute('disabled', 'disabled');
        } else {
            this.buttonElement.removeAttribute('disabled');
        }
    }
}