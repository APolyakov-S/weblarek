import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types';
import { IOrderForm } from '../../types';
import { FormBase } from './FormBase';

export class OrderForm extends FormBase<IOrderForm> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container,
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );

    this.cardButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', { payment: 'card' });
    });

    this.cashButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', { payment: 'cash' });
    });

    this.addressInput.addEventListener('input', () => {
      this.events.emit('order.address:change', {
        address: this.addressInput.value,
      });
    });

  }

  set payment(value: TPayment | null) {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}