import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { IContactsForm } from '../../types';
import { FormBase } from './FormBase';

export class ContactsForm extends FormBase<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );

    this.emailInput.addEventListener('input', () => {
      this.events.emit('contacts.email:change', {
        email: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener('input', () => {
      this.events.emit('contacts.phone:change', {
        phone: this.phoneInput.value,
      });
    });

  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}