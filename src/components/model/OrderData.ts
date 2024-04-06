import { FormErrors, IOrder, IOrderForm, IProduct } from '../../types';
import { Model } from '../base/Model';
import { removeItem } from '../../utils/utils';

export class OrderData extends Model<IOrderForm> {
	formErrors: FormErrors = {};
	order: IOrder = {
		total: 0,
		items: [],
	};

	orderForm: IOrderForm = {
		payment: '',
		address: '',
		email: '',
		phone: '',
	};

	setItem(item: IProduct) {
		if (item.price) {
			this.order.items.push(item.id);
		}
	}

	removeItem(item: string) {
		removeItem(this.order.items, item);
	}

	validateDeliveryForm() {
		const errors: typeof this.formErrors = {};
		if (!this.orderForm.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.orderForm.address) {
			errors.address = 'Необходимо указать адрес';
		}

		if (!this.orderForm.phone) {
			errors.phone = 'Необходимо указать номер телефона';
		}

		if (!this.orderForm.email) {
			errors.phone = 'Необходимо указать почту';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setOrderForm(field: keyof IOrderForm, value: string) {
		this.orderForm[field] = value;

		if (this.validateDeliveryForm()) {
			this.events.emit('order:ready', this.order);
		}
	}
}
