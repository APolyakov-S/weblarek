import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class BasketView extends Component<{ items: HTMLElement[]; total: number }> {
    private itemsContainer: HTMLElement;
    private totalElement: HTMLElement;
    private orderButton: HTMLButtonElement;
    private emptyMessage: HTMLElement;

    constructor(container: HTMLElement, private events?: EventEmitter) {
        super(container);
        this.itemsContainer = ensureElement('.basket__list', this.container);
        this.totalElement = ensureElement('.basket__price', this.container);
        this.orderButton = ensureElement('.basket__button', this.container) as HTMLButtonElement;
        
        this.emptyMessage = document.createElement('p');
        this.emptyMessage.textContent = 'Корзина пуста';
        this.emptyMessage.classList.add('basket__empty');
        
        this.orderButton.addEventListener('click', () => {
            this.events?.emit('basket:order');
        });
    }

    setItems(items: HTMLElement[]): void {
        this.itemsContainer.innerHTML = '';
        if (items.length === 0) {
            this.itemsContainer.appendChild(this.emptyMessage);
            this.orderButton.disabled = true;
        } else {
            items.forEach(item => this.itemsContainer.appendChild(item));
            this.orderButton.disabled = false;
        }
    }

    setTotal(total: number): void {
        this.totalElement.textContent = `${total} синапсов`;
    }

    render(data?: { items: HTMLElement[]; total: number }): HTMLElement {
        if (data) {
            this.setItems(data.items);
            this.setTotal(data.total);
        }
        return this.container;
    }
}