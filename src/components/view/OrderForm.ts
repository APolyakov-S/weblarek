import { Form } from './Form';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IOrderFormData {
    payment: 'card' | 'cash';
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    private cardButton: HTMLButtonElement;
    private cashButton: HTMLButtonElement;
    private addressInput: HTMLInputElement;

    constructor(container: HTMLElement, events?: EventEmitter) {
        super(container, events);
        
        this.cardButton = ensureElement('.button_alt', this.container) as HTMLButtonElement;
        this.cashButton = ensureElement('.button_alt', this.container) as HTMLButtonElement;
        this.addressInput = this.findInput('address') as HTMLInputElement;
        
        this.cardButton.addEventListener('click', () => this.setPayment('card'));
        this.cashButton.addEventListener('click', () => this.setPayment('cash'));
        this.addressInput.addEventListener('input', () => this.validate());
        
        this.submitButton.addEventListener('click', () => {
            if (this.validate()) {
                this.events?.emit('order:submit', this.getValue());
            }
        });
    }

    protected getEventPrefix(): string {
        return 'order';
    }

    setPayment(method: 'card' | 'cash'): void {
        this.cardButton.classList.toggle('button_alt-active', method === 'card');
        this.cashButton.classList.toggle('button_alt-active', method === 'cash');
        this.validate();
    }

    setAddress(address: string): void {
        if (this.addressInput) {
            this.addressInput.value = address;
            this.validate();
        }
    }

    getValue(): IOrderFormData {
        return {
            payment: this.cardButton.classList.contains('button_alt-active') ? 'card' : 'cash',
            address: this.addressInput?.value || ''
        };
    }

    private validate(): boolean {
        const hasPayment = this.cardButton.classList.contains('button_alt-active') || 
                          this.cashButton.classList.contains('button_alt-active');
        const hasAddress = this.addressInput && this.addressInput.value.trim().length > 0;
        const isValid = hasPayment && hasAddress;
        
        this.setValid(isValid);
        
        if (!hasPayment) {
            this.setErrors({ payment: 'Выберите способ оплаты' });
        } else if (!hasAddress) {
            this.setErrors({ address: 'Укажите адрес доставки' });
        } else {
            this.setErrors({});
        }
        
        return isValid;
    }
}