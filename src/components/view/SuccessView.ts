import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface ISuccessData {
    total: number;
}

export class SuccessView extends Component<ISuccessData> {
    private totalElement: HTMLElement;
    private closeButton: HTMLButtonElement;
    private events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this.totalElement = ensureElement('.order-success__description', this.container);
        this.closeButton = ensureElement('.order-success__close', this.container) as HTMLButtonElement;
        
        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }
    
    set total(value: number) {
        this.totalElement.textContent = `Списано ${value} синапсов`;
    }
    
    render(data?: ISuccessData): HTMLElement {
        if (data?.total !== undefined) {
            this.total = data.total;
        }
        return this.container;
    }
}