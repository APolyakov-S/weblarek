import { EventEmitter } from '../base/Events';
import { ViewContainer } from './ViewContainer';
import { ensureElement } from '../../utils/utils';

export interface IPageView {
    catalog: HTMLElement[];
    counter: number;
}

export class PageView extends ViewContainer<IPageView> {
    private galleryElement: HTMLElement;
    private basketCounter: HTMLElement;
    private basketButton: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);
        
        this.galleryElement = ensureElement('.gallery', this.container);
        this.basketCounter = ensureElement('.header__basket-counter', this.container);
        this.basketButton = ensureElement('.header__basket', this.container);
        
        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set catalog(cards: HTMLElement[]) {
        this.galleryElement.replaceChildren(...cards);
    }

    set counter(count: number) {
        this.basketCounter.textContent = String(count);
    }

    render(data?: Partial<IPageView>): HTMLElement {
        if (data?.catalog) this.catalog = data.catalog;
        if (data?.counter !== undefined) this.counter = data.counter;
        return this.container;
    }
}