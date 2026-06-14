import { IBuyer, TPayment, TBuyerErrors } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel {
  private payment: TPayment | null = null;
  private address: string = '';
  private email: string = '';
  private phone: string = '';

  constructor(protected events: IEvents) {}

  update(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
    this.events.emit('buyer:changed');
  };

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone
    };
  };

  clear(): void {
      this.payment = null;
      this.address = '';
      this.email = '';
      this.phone = '';

      this.events.emit('buyer:changed');
    };
  
  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.payment) errors.payment = 'Не выбран способ оплаты';
    if (!this.address.trim()) errors.address = 'Введите адрес';
    if (!this.email.trim()) errors.email = 'Введите email';
    if (!this.phone.trim()) errors.phone = 'Введите телефон';

    return errors;
  };
}