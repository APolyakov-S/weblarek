import { Component } from '../base/Component';
import { IModal } from '../../types';
import { EventEmitter } from '../base/Events';

export class Modal extends Component<IModal> {
    private modalElement: HTMLElement;
    private contentElement: HTMLElement | null;
    private closeButtonElement: HTMLElement | null;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        
        this.modalElement = container;
        this.contentElement = container.querySelector('.modal__content');
        this.closeButtonElement = container.querySelector('.modal__close');
        
        if (this.closeButtonElement) {
            this.closeButtonElement.addEventListener('click', () => {
                this.close();
            });
        }
        
        this.modalElement.addEventListener('click', (e) => {
            if (e.target === this.modalElement) {
                this.close();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    private isOpen(): boolean {
        return this.modalElement.classList.contains('modal_active');
    }

    public isActive(): boolean {
        return this.modalElement.classList.contains('modal_active');
    }

    open(): void {
        this.modalElement.classList.add('modal_active');
        document.body.classList.add('modal-open');
    }

    close(): void {
        this.modalElement.classList.remove('modal_active');
        document.body.classList.remove('modal-open');
        this.events.emit('modal:closed');
    }

    set content(value: HTMLElement) {
        if (this.contentElement) {
            this.contentElement.innerHTML = '';
            this.contentElement.appendChild(value);
        }
    }

    render(data?: Partial<IModal>): HTMLElement {
        if (data?.content) {
            this.content = data.content;
        }
        return this.modalElement;
    }
}