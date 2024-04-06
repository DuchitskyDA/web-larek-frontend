import { Component } from './base/Component';
import { IProduct } from '../types';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard extends IProduct {
	basketId?: string;
	button: string;
}

export class Card extends Component<ICard> {
	protected _basketId: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._basketId = container.querySelector('.basket__item-index');
		this._category = container.querySelector('.card__category');
		this._title = container.querySelector('.card__title');
		this._image = container.querySelector('.card__image');
		this._description = container.querySelector('.card__text');
		this._button = container.querySelector('.card__button');
		this._price = container.querySelector('.card__price');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	// номер карточки в корзине
	set basketId(value: string) {
		this._basketId.textContent = value;
	}

	get basketId() {
		return this._basketId.textContent;
	}

	// цвет категории
	categoryColor(value: string): string {
		if (value === 'софт-скил') {
			return 'card__category_soft';
		} else if (value === 'хард-скил') {
			return 'card__category_hard';
		} else if (value === 'кнопка') {
			return 'card__category_button';
		} else if (value === 'дополнительное') {
			return 'card__category_additional';
		} else {
			return 'card__category_other';
		}
	}

	// категория
	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(this._category, this.categoryColor(value));
	}

	// id карточки
	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	// тайтл карточки
	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	// изображение
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	// описание
	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	// кнопка
	set button(value: string) {
		if (this._button) this._button.textContent = value;
	}

	// цена
	set price(value: number | null) {
		!value
			? this.setText(this._price, 'Бесценно')
			: this.setText(this._price, `${value.toString()} синапса(-ов)`);
	}

	get price(): number {
		return Number(this._price.textContent || '');
	}
}
