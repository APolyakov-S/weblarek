import { EventEmitter } from '../base/Events';
import { Card, ICardData } from './Card';

export interface IBasketCardData extends ICardData {
    index: number;
}

export class BasketCard extends Card<IBasketCardData> {
    constructor(container: HTMLElement, events?: EventEmitter) {
        super(container, events);
        
        const deleteButton = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                this.events?.emit('basket:remove', { id: this.container.dataset.id });
            });
        }
    }

    set data(value: IBasketCardData) {
        this.container.dataset.id = value.id;
        this.setTitle(value.title);
        this.setPrice(value.price);
        this.setIndex(value.index);
    }
}