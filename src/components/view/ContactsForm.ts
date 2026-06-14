import { Form } from './Form';
import { EventEmitter } from '../base/Events';

export interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events?: EventEmitter) {
        super(container, events);
        
        this.emailInput = this.findInput('email') as HTMLInputElement;
        this.phoneInput = this.findInput('phone') as HTMLInputElement;
        
        this.emailInput.addEventListener('input', () => this.validate());
        this.phoneInput.addEventListener('input', () => this.validate());
        
        this.submitButton.addEventListener('click', () => {
            if (this.validate()) {
                this.events?.emit('contacts:submit', this.getValue());
            }
        });
    }

    protected getEventPrefix(): string {
        return 'contacts';
    }

    getValue(): IContactsFormData {
        return {
            email: this.emailInput?.value || '',
            phone: this.phoneInput?.value || ''
        };
    }

    private validate(): boolean {
        const email = this.emailInput?.value.trim() || '';
        const phone = this.phoneInput?.value.trim() || '';
        const isValid = email.length > 0 && phone.length > 0;
        
        this.setValid(isValid);
        
        if (!email) {
            this.setErrors({ email: 'Укажите email' });
        } else if (!phone) {
            this.setErrors({ phone: 'Укажите телефон' });
        } else {
            this.setErrors({});
        }
        
        return isValid;
    }
}