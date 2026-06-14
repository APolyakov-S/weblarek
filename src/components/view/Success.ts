import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { ISuccess } from '../../types';

export class Success extends Component<ISuccess> {
  protected successDescription: HTMLElement;
  protected successButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.successDescription = ensureElement<HTMLElement>(
      '.order-success__description',
      this.container,
    );

    this.successButton = ensureElement<HTMLButtonElement>(
      '.order-success__close',
      this.container,
    );

    this.successButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set total(value: number) {
    this.successDescription.textContent = `Списано ${value} синапсов`;
  }
}
