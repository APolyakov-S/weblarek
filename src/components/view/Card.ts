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
    description?: string;
    index?: number;
}

export abstract class Card<T extends ICardData> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected imageElement?: HTMLImageElement;
    protected categoryElement?: HTMLElement;
    protected descriptionElement?: HTMLElement;
    protected indexElement?: HTMLElement;
    protected buttonElement?: HTMLButtonElement;

    constructor(container: HTMLElement, protected events?: EventEmitter) {
        super(container);
        this.titleElement = ensureElement('.card__title', this.container);
        this.priceElement = ensureElement('.card__price', this.container);
        this.imageElement = this.container.querySelector('.card__image') as HTMLImageElement;
        this.categoryElement = this.container.querySelector('.card__category') as HTMLElement;
        this.descriptionElement = this.container.querySelector('.card__description') as HTMLElement;
        this.indexElement = this.container.querySelector('.basket__item-index') as HTMLElement;
        this.buttonElement = this.container.querySelector('.card__button') as HTMLButtonElement;
    }

    setTitle(value: string): void {
        this.titleElement.textContent = value;
    }

    setCardImage(src: string, alt?: string): void {
        if (this.imageElement) {
            this.imageElement.src = src;
            if (alt) this.imageElement.alt = alt;
        }
    }

    setPrice(value: number | null): void {
        if (value === null) {
            this.priceElement.textContent = 'Бесценно';
        } else {
            this.priceElement.textContent = `${value} синапсов`;
        }
    }

    setCategory(value: string): void {
        if (!this.categoryElement) return;
        this.categoryElement.textContent = value;
        const className = categoryMap[value as keyof typeof categoryMap];
        if (className) {
            this.categoryElement.classList.add(className);
        }
    }

    setDescription(value: string): void {
        if (this.descriptionElement) {
            this.descriptionElement.textContent = value;
        }
    }

    setIndex(value: number): void {
        if (this.indexElement) {
            this.indexElement.textContent = String(value);
        }
    }

    toggleButton(state: { label: string; disabled: boolean }): void {
        if (this.buttonElement) {
            this.buttonElement.textContent = state.label;
            this.buttonElement.disabled = state.disabled;
        }
    }
}