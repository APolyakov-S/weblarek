import { IBuyer, TPayment } from '../../types';
import { EventEmitter } from '../base/Events';

export class OrderModel {
    private payment: TPayment | null = null;
    private address: string = '';
    private email: string = '';
    private phone: string = '';

    constructor(private events: EventEmitter) {}

    setPayment(payment: TPayment): void {
        this.payment = payment;
        this.events.emit('order:changed', this.getOrderData());
    }

    setAddress(address: string): void {
        this.address = address;
        this.events.emit('order:changed', this.getOrderData());
    }

    setEmail(email: string): void {
        this.email = email;
        this.events.emit('order:changed', this.getOrderData());
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.events.emit('order:changed', this.getOrderData());
    }

    setField(field: keyof IBuyer, value: string | TPayment): void {
        switch (field) {
            case 'payment':
                this.setPayment(value as TPayment);
                break;
            case 'address':
                this.setAddress(value as string);
                break;
            case 'email':
                this.setEmail(value as string);
                break;
            case 'phone':
                this.setPhone(value as string);
                break;
        }
    }

    getOrderData(): IBuyer {
        return {
            payment: this.payment!,
            address: this.address,
            email: this.email,
            phone: this.phone
        };
    }

    clear(): void {
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
        this.events.emit('order:cleared');
    }

    validate(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};
        
        if (!this.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if (!this.address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }
        if (!this.email.trim()) {
            errors.email = 'Укажите email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
            errors.email = 'Введите корректный email';
        }
        if (!this.phone.trim()) {
            errors.phone = 'Укажите телефон';
        } else if (!/^[\d+\s()-]+$/.test(this.phone)) {
            errors.phone = 'Введите корректный телефон';
        }
        
        return errors;
    }

    validateFirstStep(): boolean {
        return !!this.payment && !!this.address.trim();
    }

    validateSecondStep(): boolean {
        return !!this.email.trim() && !!this.phone.trim();
    }
}