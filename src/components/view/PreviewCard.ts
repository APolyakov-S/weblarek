import { EventEmitter } from '../base/Events';
import { Card, ICardData } from './Card';
import { ensureElement } from '../../utils/utils';

export interface IPreviewCardData extends ICardData {
    description: string;
    category: string;
    image: string;
    isInBasket: boolean;
}

export class PreviewCard extends Card<IPreviewCardData> {
    private descriptionElement: HTMLElement;
    private categoryElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private buttonElement: HTMLButtonElement;
    
    constructor(template: HTMLTemplateElement, events: EventEmitter) {
        const container = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
        super(container, events);
        
        this.descriptionElement = ensureElement('.card__description', this.container);
        this.categoryElement = ensureElement('.card__category', this.container);
        this.imageElement = ensureElement('.card__image', this.container) as HTMLImageElement;
        this.buttonElement = ensureElement('.card__button', this.container) as HTMLButtonElement;
        
        this.buttonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = this.buttonElement.textContent === 'Удалить из корзины' ? 'remove' : 'add';
            if (action === 'remove') {
                this.events.emit('product:removeFromBasket', { id: this.container.dataset.id });
            } else {
                this.events.emit('product:addToBasket', { id: this.container.dataset.id });
            }
        });
    }
    
    set description(value: string) {
        this.descriptionElement.textContent = value;
    }
    
    set isInBasket(value: boolean) {
        const price = this.priceElement.textContent === 'Бесценно' ? null : parseInt(this.priceElement.textContent || '0');
        
        if (price === null) {
            this.buttonElement.textContent = 'Недоступно';
            this.buttonElement.disabled = true;
        } else if (value) {
            this.buttonElement.textContent = 'Удалить из корзины';
            this.buttonElement.disabled = false;
        } else {
            this.buttonElement.textContent = 'Купить';
            this.buttonElement.disabled = false;
        }
    }
    
    set data(value: IPreviewCardData) {
        this.id = value.id;
        this.title = value.title;
        this.price = value.price;
        this.description = value.description;
        this.setCategory(value.category);
        this.setCardImage(value.image, value.title);
    }
    
    render(data?: Partial<IPreviewCardData>): HTMLElement {
        if (data) {
            if (data.id !== undefined) this.id = data.id;
            if (data.title !== undefined) this.title = data.title;
            if (data.price !== undefined) this.price = data.price;
            if (data.description !== undefined) this.description = data.description;
            if (data.category !== undefined) this.setCategory(data.category);
            if (data.image !== undefined) this.setCardImage(data.image, data.title || '');
            if (data.isInBasket !== undefined) this.isInBasket = data.isInBasket;
        }
        return this.container;
    }
}