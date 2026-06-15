import { Component } from '../base/Component';
import { IModal } from '../../types';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<IModal> {
    private modalElement: HTMLElement;
    private contentElement: HTMLElement;
    private closeButtonElement: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.modalElement = container;
        this.contentElement = ensureElement<HTMLElement>('.modal__content', container);
        this.closeButtonElement = ensureElement<HTMLElement>('.modal__close', container);

        this.closeButtonElement.addEventListener('click', () => {
            this.close();
        });

        this.modalElement.addEventListener('click', (e) => {
            if (e.target === this.modalElement) {
                this.close();
            }
        });
    }

    open(): void {
        this.modalElement.classList.add('modal_active');
    }

    close(): void {
        this.modalElement.classList.remove('modal_active');
    }

    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }

    render(data?: Partial<IModal>): HTMLElement {
        if (data?.content) {
            this.content = data.content;
        }
        return this.modalElement;
    }
}