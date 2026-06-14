import { EventEmitter } from '../base/Events';
import { Card, ICardData } from './Card';

export interface IPreviewCardData extends ICardData {
    description: string;
    category: string;
    image: string;
    isInBasket: boolean;
}

export class PreviewCard extends Card<IPreviewCardData> {
    constructor(container: HTMLElement, events?: EventEmitter) {
        super(container, events);
        
        if (this.buttonElement) {
            this.buttonElement.addEventListener('click', (e) => {
                e.stopPropagation();
                const isRemove = this.buttonElement?.textContent === 'Удалить из корзины';
                if (isRemove) {
                    this.events?.emit('card:remove', { id: this.container.dataset.id });
                } else {
                    this.events?.emit('card:add', { id: this.container.dataset.id });
                }
            });
        }
    }

    set data(value: IPreviewCardData) {
        this.container.dataset.id = value.id;
        this.setTitle(value.title);
        this.setPrice(value.price);
        this.setDescription(value.description);
        this.setCategory(value.category);
        this.setCardImage(value.image, value.title);
        this.updateButton(value.isInBasket);
    }

    private updateButton(isInBasket: boolean): void {
        const price = this.getPriceFromText();
        
        if (price === null) {
            this.toggleButton({ label: 'Недоступно', disabled: true });
        } else if (isInBasket) {
            this.toggleButton({ label: 'Удалить из корзины', disabled: false });
        } else {
            this.toggleButton({ label: 'Купить', disabled: false });
        }
    }

    private getPriceFromText(): number | null {
        const priceText = this.priceElement.textContent;
        if (priceText === 'Бесценно') return null;
        const price = parseInt(priceText || '0');
        return isNaN(price) ? null : price;
    }
}