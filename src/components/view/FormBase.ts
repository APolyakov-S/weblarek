import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { IFormState } from '../../types';

export abstract class FormBase<T> extends Component<T & IFormState> {
  protected form: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected formErrors: HTMLElement;

  constructor(
    container: HTMLFormElement,
    protected events: IEvents,
  ) {
    super(container);

    this.form = container;

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );

    this.formErrors = ensureElement<HTMLElement>(
      '.form__errors',
      this.container,
    );

    this.container.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit(`${this.container.getAttribute('name')}:submit`);
    });

  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.formErrors.textContent = value;
  }
}