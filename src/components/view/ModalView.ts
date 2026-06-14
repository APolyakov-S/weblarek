import { EventEmitter } from '../base/Events';
import { ViewContainer } from './ViewContainer';
import { ensureElement } from '../../utils/utils';

export interface IModalView {
    content: HTMLElement;
}

export class ModalView extends ViewContainer<IModalView> {
    private closeButton: HTMLElement;
    private contentContainer: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);
        
        this.closeButton = ensureElement('.modal__close', this.container);
        this.contentContainer = ensureElement('.modal__content', this.container);
        
        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    get isOpen(): boolean {
        return this.container.classList.contains('modal_active');
    }

    set content(content: HTMLElement) {
        this.contentContainer.innerHTML = '';
        this.contentContainer.appendChild(content);
    }

    open(): void {
        this.container.classList.add('modal_active');
        document.body.style.overflow = 'hidden';
    }

    close(): void {
        this.container.classList.remove('modal_active');
        document.body.style.overflow = '';
        this.events.emit('modal:close');
    }

    render(data?: Partial<IModalView>): HTMLElement {
        if (data?.content) this.content = data.content;
        this.open();
        return this.container;
    }
}