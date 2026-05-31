import { IBuyer, TPayment, TValidationErrors } from '../../types';

export class BuyerModel {
    private payment: TPayment | null = null;
    private address: string = '';
    private email: string = '';
    private phone: string = '';

    public setPayment(payment: TPayment): void {
        this.payment = payment;
    }

    public setAddress(address: string): void {
        this.address = address;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public setPhone(phone: string): void {
        this.phone = phone;
    }

    public getBuyerData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    public clear(): void {
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
    }

    public validate(): TValidationErrors {
        const errors: TValidationErrors = {};

        if (this.payment === null) {
            errors.payment = 'Не выбран способ оплаты';
        }

        if (!this.address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }

        if (!this.email.trim()) {
            errors.email = 'Укажите email';
        }

        if (!this.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}