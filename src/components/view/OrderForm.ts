import { EventEmitter } from '../base/Events';
import { Form, IFormData } from './Form';
import { ensureElement } from '../../utils/utils';

export interface IOrderFormData extends IFormData {
    payment: 'card' | 'cash';
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    private cardButton: HTMLButtonElement;
    private cashButton: HTMLButtonElement;
    private addressInput: HTMLInputElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events, 'order:submit');
        
        this.cardButton = ensureElement('.button_alt-card', this.container) as HTMLButtonElement;
        this.cashButton = ensureElement('.button_alt-cash', this.container) as HTMLButtonElement;
        this.addressInput = this.inputs.get('address') as HTMLInputElement;
        
        this.cardButton.addEventListener('click', () => this.selectPayment('card'));
        this.cashButton.addEventListener('click', () => this.selectPayment('cash'));
    }
    
    private selectPayment(payment: 'card' | 'cash'): void {
        this.cardButton.classList.toggle('button_alt-active', payment === 'card');
        this.cashButton.classList.toggle('button_alt-active', payment === 'cash');
        
        const formData = this.getFormData();
        this.events.emit('form:changed', formData);
        this.validate();
    }
    
    private getFormData(): IOrderFormData {
        return {
            payment: this.cardButton.classList.contains('button_alt-active') ? 'card' : 'cash',
            address: this.addressInput?.value || ''
        };
    }
    
    public validate(): boolean {
        const hasPayment = this.cardButton.classList.contains('button_alt-active') || 
                          this.cashButton.classList.contains('button_alt-active');
        const hasAddress = this.addressInput && this.addressInput.value.trim().length > 0;
        const isValid = hasPayment && hasAddress;
        
        this.submitButton.disabled = !isValid;
        
        if (!hasPayment) {
            this.errorContainer.textContent = 'Выберите способ оплаты';
        } else if (!hasAddress) {
            this.errorContainer.textContent = 'Укажите адрес доставки';
        } else {
            this.errorContainer.textContent = '';
        }
        
        return isValid;
    }
    
    set data(value: IOrderFormData) {
        this.selectPayment(value.payment);
        if (this.addressInput) {
            this.addressInput.value = value.address;
        }
        this.validate();
    }
}