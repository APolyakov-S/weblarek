import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IFormData {
    [key: string]: string;
}

export abstract class Form<T extends IFormData> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorContainer: HTMLElement;
    protected inputs: Map<string, HTMLInputElement>;
    protected submitEventName: string;
    protected events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter, submitEventName: string) {
        super(container);
        this.events = events;
        this.submitEventName = submitEventName;
        this.inputs = new Map();
        
        this.submitButton = ensureElement('.order__button', this.container) as HTMLButtonElement;
        this.errorContainer = ensureElement('.form__errors', this.container);
        
        const allInputs = this.container.querySelectorAll('input, textarea');
        allInputs.forEach((input) => {
            const element = input as HTMLInputElement;
            if (element.name) {
                this.inputs.set(element.name, element);
                element.addEventListener('input', () => this.onInputChange());
            }
        });
        
        this.submitButton.addEventListener('click', () => this.onSubmit());
    }
    
    set data(value: T) {
        Object.keys(value).forEach(key => {
            const input = this.inputs.get(key);
            if (input) {
                input.value = value[key];
            }
        });
        this.validate();
    }
    
    showErrors(errors: Partial<Record<keyof T, string>>): void {
        const firstError = Object.values(errors)[0];
        this.errorContainer.textContent = firstError || '';
    }
    
    protected abstract validate(): boolean;
    
    protected onInputChange(): void {
        this.validate();
        
        const formData = {} as T;
        this.inputs.forEach((input, key) => {
            (formData as any)[key] = input.value;
        });
        
        this.events.emit('form:changed', formData);
    }
    
    protected onSubmit(): void {
        if (this.validate()) {
            const formData = {} as T;
            this.inputs.forEach((input, key) => {
                (formData as any)[key] = input.value;
            });
            this.events.emit(this.submitEventName, formData);
        }
    }
}