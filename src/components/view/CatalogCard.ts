import { EventEmitter } from '../base/Events';
import { Card, ICardData } from './Card';

export interface ICatalogCardData extends ICardData {
    category: string;
    image: string;
}

export class CatalogCard extends Card<ICatalogCardData> {
    constructor(container: HTMLElement, events?: EventEmitter) {
        super(container, events);
        this.container.addEventListener('click', () => {
            if (this.events) {
                this.events.emit('card:select', { id: this.container.dataset.id });
            }
        });
    }

    set data(value: ICatalogCardData) {
        this.container.dataset.id = value.id;
        this.setTitle(value.title);
        this.setPrice(value.price);
        this.setCategory(value.category);
        this.setCardImage(value.image, value.title);
    }
}