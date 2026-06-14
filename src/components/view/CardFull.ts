import { Component } from '../base/Component';
import { ICardFull, TCardFullActions } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class CardFull extends Component<ICardFull> {
    private titleElement: HTMLElement | null;
    private priceElement: HTMLElement | null;
    private categoryElement: HTMLElement | null;
    private imageElement: HTMLImageElement | null;
    private descriptionElement: HTMLElement | null;
    private buttonElement: HTMLButtonElement | null;

    constructor(container: HTMLElement, actions?: TCardFullActions) {
        super(container);
        
        this.titleElement = container.querySelector('.card__title');
        this.priceElement = container.querySelector('.card__price');
        this.categoryElement = container.querySelector('.card__category');
        this.imageElement = container.querySelector('.card__image');
        this.descriptionElement = container.querySelector('.card__text');
        this.buttonElement = container.querySelector('.card__button');
        
        if (this.buttonElement && actions?.onButtonClick) {
            this.buttonElement.addEventListener('click', actions.onButtonClick);
        }
    }

    set title(value: string) {
        if (this.titleElement) this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        if (this.priceElement) {
            if (value === null) {
                this.priceElement.textContent = 'Бесценно';
            } else {
                this.priceElement.textContent = `${value} синапсов`;
            }
        }
    }

    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
            const categoryMap: Record<string, string> = {
                'софт-скилс': 'card__category_soft',
                'хард-скилс': 'card__category_hard',
                'другое': 'card__category_other',
                'дополнительное': 'card__category_additional',
                'кнопка': 'card__category_button'
            };
            const className = categoryMap[value] || 'card__category_other';
            this.categoryElement.className = `card__category ${className}`;
        }
    }

    set image(value: string) {
        if (this.imageElement) {
            const fullUrl = value.startsWith('http') ? value : CDN_URL + value;
            this.imageElement.src = fullUrl;
            this.imageElement.alt = this.title || 'product';
        }
    }

    set description(value: string) {
        if (this.descriptionElement) this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        if (this.buttonElement) this.buttonElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        if (this.buttonElement) {
            if (value) {
                this.buttonElement.setAttribute('disabled', 'disabled');
            } else {
                this.buttonElement.removeAttribute('disabled');
            }
        }
    }

    render(data: ICardFull): HTMLElement {
        this.title = data.title;
        this.price = data.price;
        this.category = data.category;
        this.image = data.image;
        this.description = data.description;
        this.buttonText = data.buttonText;
        this.buttonDisabled = data.buttonDisabled;
        return this.container;
    }
}