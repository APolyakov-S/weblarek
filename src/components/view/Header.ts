import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Header extends Component<{ counter: number }> {
    private basketCounter: HTMLElement;
    private basketButton: HTMLElement;

    constructor(container: HTMLElement, private events?: EventEmitter) {
        super(container);
        this.basketCounter = ensureElement('.header__basket-counter', this.container);
        this.basketButton = ensureElement('.header__basket', this.container);
        
        this.basketButton.addEventListener('click', () => {
            this.events?.emit('header:basket');
        });
    }

    setCounter(count: number): void {
        this.basketCounter.textContent = String(count);
    }

    render(data?: { counter: number }): HTMLElement {
        if (data?.counter !== undefined) {
            this.setCounter(data.counter);
        }
        return this.container;
    }
}