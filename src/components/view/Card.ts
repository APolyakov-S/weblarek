import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export interface ICardData {
    id: string;
    title: string;
    price: number | null;
    category?: string;
    image?: string;
}

export abstract class Card<T extends ICardData> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.titleElement = ensureElement('.card__title', this.container);
        this.priceElement = ensureElement('.card__price', this.container);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        if (value === null) {
            this.priceElement.textContent = 'Бесценно';
        } else {
            this.priceElement.textContent = `${value} синапсов`;
        }
    }

    protected setCategory(value: string): void {
        const categoryElement = this.container.querySelector('.card__category');
        if (!categoryElement) return;

        categoryElement.textContent = value;
        
        const className = categoryMap[value as keyof typeof categoryMap];
        if (className) {
            categoryElement.classList.add(className);
        }
    }

    protected setCardImage(value: string, alt: string = ''): void {
        const imageElement = this.container.querySelector('.card__image') as HTMLImageElement;
        if (imageElement) {
            imageElement.src = value;
            imageElement.alt = alt;
        }
    }
}