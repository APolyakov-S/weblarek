import { EventEmitter } from '../base/Events';
import { Card, ICardData } from './Card';
import { ensureElement } from '../../utils/utils';

export interface IBasketCardData extends ICardData {
    index: number;
}

export class BasketCard extends Card<IBasketCardData> {
    private indexElement: HTMLElement;
    private deleteButton: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, events: EventEmitter) {
        const container = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
        super(container, events);
        
        this.indexElement = ensureElement('.basket__item-index', this.container);
        this.deleteButton = ensureElement('.basket__item-delete', this.container) as HTMLButtonElement;
        
        this.deleteButton.addEventListener('click', () => {
            this.events.emit('product:removeFromBasket', { id: this.container.dataset.id });
        });
    }
    
    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
    
    set data(value: IBasketCardData) {
        this.id = value.id;
        this.title = value.title;
        this.price = value.price;
        this.index = value.index;
    }
    
    render(data?: Partial<IBasketCardData>): HTMLElement {
        if (data) this.data = data as IBasketCardData;
        return this.container;
    }
}