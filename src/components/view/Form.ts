import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsContainer: HTMLElement;

    constructor(container: HTMLElement, protected events?: EventEmitter) {
        super(container);
        this.submitButton = ensureElement('.order__button', this.container) as HTMLButtonElement;
        this.errorsContainer = ensureElement('.form__errors', this.container);
        
        this.container.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.name) {
                this.events?.emit(`${this.getEventPrefix()}.${target.name}:change`, { 
                    field: target.name, 
                    value: target.value 
                });
            }
        });
    }

    protected abstract getEventPrefix(): string;

    setValid(valid: boolean): void {
        this.submitButton.disabled = !valid;
    }

    setErrors(errors: Partial<Record<keyof T, string>>): void {
        const errorValues = Object.values(errors) as string[];
        const firstError: string | undefined = errorValues[0];
        this.errorsContainer.textContent = firstError ? firstError : null;
    }

    clear(): void {
        this.container.querySelectorAll('input').forEach(input => {
            input.value = '';
        });
        this.errorsContainer.textContent = null;
    }

    protected findInput(name: string): HTMLInputElement | null {
        return this.container.querySelector(`input[name="${name}"]`);
    }
}