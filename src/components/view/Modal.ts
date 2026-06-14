import { ensureElement } from '../../utils/utils';

export class Modal {
    private container: HTMLElement;
    private contentContainer: HTMLElement;
    private closeButton: HTMLElement;

    constructor(container: HTMLElement, private onClose?: () => void) {
        this.container = container;
        this.contentContainer = ensureElement('.modal__content', this.container);
        this.closeButton = ensureElement('.modal__close', this.container);
        
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

    open(content?: HTMLElement): void {
        if (content) {
            this.contentContainer.innerHTML = '';
            this.contentContainer.appendChild(content);
        }
        this.container.classList.add('modal_active');
        document.body.style.overflow = 'hidden';
    }

    close(): void {
        this.container.classList.remove('modal_active');
        document.body.style.overflow = '';
        if (this.onClose) {
            this.onClose();
        }
    }
}