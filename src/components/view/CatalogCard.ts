import { EventEmitter } from '../base/Events';
import { Card, ICardData } from './Card';
import { ensureElement } from '../../utils/utils';

export interface ICatalogCardData extends ICardData {
    category: string;
    image: string;
}

export class CatalogCard extends Card<ICatalogCardData> {
    private categoryElement: HTMLElement;
    private imageElement: HTMLImageElement;
    
    constructor(template: HTMLTemplateElement, events: EventEmitter) {
        const container = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
        super(container, events);
        
        this.categoryElement = ensureElement('.card__category', this.container);
        this.imageElement = ensureElement('.card__image', this.container) as HTMLImageElement;
        
        this.container.addEventListener('click', () => {
            this.events.emit('card:select', { id: this.container.dataset.id });
        });
    }
    
    set data(value: ICatalogCardData) {
        this.id = value.id;
        this.title = value.title;
        this.price = value.price;
        this.setCategory(value.category);
        this.setCardImage(value.image, value.title);
    }
    
    render(data?: Partial<ICatalogCardData>): HTMLElement {
        if (data) this.data = data as ICatalogCardData;
        return this.container;
    }
}