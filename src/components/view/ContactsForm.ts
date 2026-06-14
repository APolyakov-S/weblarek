import { EventEmitter } from '../base/Events';
import { Form, IFormData } from './Form';

export interface IContactsFormData extends IFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    
    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events, 'contacts:submit');
        
        this.emailInput = this.inputs.get('email') as HTMLInputElement;
        this.phoneInput = this.inputs.get('phone') as HTMLInputElement;
    }
    
    public validate(): boolean {
        const email = this.emailInput ? this.emailInput.value.trim() : '';
        const phone = this.phoneInput ? this.phoneInput.value.trim() : '';
        
        const isValid = email.length > 0 && phone.length > 0;
        
        this.submitButton.disabled = !isValid;
        
        if (!email) {
            this.errorContainer.textContent = 'Укажите email';
        } else if (!phone) {
            this.errorContainer.textContent = 'Укажите телефон';
        } else {
            this.errorContainer.textContent = '';
        }
        
        return isValid;
    }
}