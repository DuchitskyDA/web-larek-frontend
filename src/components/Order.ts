import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';
import { ensureAllElements } from '../utils/utils';

export class Order extends Form<IOrderForm> {
	methodBtns: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.methodBtns = ensureAllElements('.button_alt', container);

		this.methodBtns.forEach((button) =>
			button.addEventListener('click', () => {
				this.setSelectedBtn(button.name);
			})
		);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	setSelectedBtn(value: string) {
		this.methodBtns.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === value);
		});
		this.events.emit('order:change', { value });
	}
}
