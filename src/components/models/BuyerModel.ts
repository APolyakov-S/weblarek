import { EventEmitter } from '../base/Events';
import { IBuyer, TPayment } from '../../types';

export class BuyerModel {
  private payment: TPayment | null = null;
  private address: string = '';
  private email: string = '';
  private phone: string = '';

  constructor(private events: EventEmitter) {}

  public setPayment(payment: TPayment): void {
    this.payment = payment;
    this.events.emit('buyer:changed', this.getBuyerData());
  }

  public setAddress(address: string): void {
    this.address = address;
    this.events.emit('buyer:changed', this.getBuyerData());
  }

  public setEmail(email: string): void {
    this.email = email;
    this.events.emit('buyer:changed', this.getBuyerData());
  }

  public setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit('buyer:changed', this.getBuyerData());
  }

  public setField(field: keyof IBuyer, value: string | TPayment): void {
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

  public getBuyerData(): IBuyer {
    return {
      payment: this.payment ?? 'card',
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
    this.events.emit('buyer:changed', this.getBuyerData());
  }

  public validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

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