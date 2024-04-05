import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { AppApi } from './components/AppAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { IOrderForm, IProduct } from './types';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { ProductsData } from './components/model/ProductsData';
import { BasketData } from './components/model/BasketData';
import { OrderData } from './components/model/OrderData';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

// Модели данных
const productsData = new ProductsData({}, events);
const basketData = new BasketData({}, events);
const orderData = new OrderData({}, events);

// страница
const page = new Page(document.body, events);

// переиспользуемое
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Поиск нужных элементов на странице
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('.basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
// карточки с сервера
api
	.getProductItem()
	.then((data) => productsData.setProductList(data))
	.catch((error) => console.log(error));

const basket = new Basket(basketTemplate, events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Order(cloneTemplate(orderContactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});
// рендер списка товаров
events.on('items:changed', () => {
	page.catalog = productsData.productList.map((item: IProduct) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

// тригерим открытие модалки
events.on('card:select', (item: IProduct) => productsData.setPreview(item));

// создаем и рендерим модалку
events.on('preview:changed', (item: IProduct) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			// Запускаем проверку товара на наличие в корзине
			events.emit('basket:check', item);
			card.button =
				basketData.basket.indexOf(item) === -1
					? 'В корзину'
					: 'Убрать из корзины';
		},
	});
	modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			description: item.description,
			button: basketData.basket.indexOf(item)
				? 'В корзину'
				: 'Убрать из корзины',
			price: item.price,
		}),
	});
});

// Проверяем есть ли выбранный товар уже в корзине
// На основе этого вызываем соответсвующее событие
events.on('basket:check', (item: IProduct) => {
	basketData.basket.indexOf(item) === -1
		? events.emit('basket:item-add', item)
		: events.emit('basket:item-remove', item);
});

events.on('basket:item-add', (item: IProduct) => {
	basketData.addToBasket(item);
	orderData.setItem(item);
});

events.on('basket:item-remove', (item: IProduct) => {
	basketData.deleteFromBasket(item);
	orderData.removeItem(item.id);
});

events.on('basket-count:change', () => {
	page.counter = basketData.basket.length;
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

events.on('basket:open', () => {
	basket.selected = basketData.basket;
	modal.render({
		content: basket.render(),
	});
});

events.on('basket:change', (items: IProduct[]) => {
	basket.items = items.map((product, basketId) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:item-remove', product);
			},
		});
		return card.render({
			basketId: (basketId + 1).toString(),
			title: product.title,
			price: product.price,
		});
	});
	basket.selected = basketData.basket;
	basket.total = items.reduce((total, item) => total + item.price, 0);
	orderData.order.total = items.reduce((total, item) => total + item.price, 0);
});

// Открыть форму заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:change', ({ value }: { value: string }) => {
	orderData.orderForm.payment = value;
	orderData.validateDeliveryForm();
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (orderErrors: Partial<IOrderForm>) => {
	const { payment, address, email, phone } = orderErrors;
	order.valid = !address && !payment;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		orderData.setOrderForm(data.field, data.value);
	}
);

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		orderData.setOrderForm(data.field, data.value);
	}
);

events.on('contacts:submit', () => {
	api
		.order({
			...orderData.orderForm,
			...orderData.order,
		})
		.then((data) => {
			basketData.fullClearBasket();
			orderData.order.items = [];
			orderData.order.total = 0;
			modal.render({
				content: success.render({
					total: data.total,
				}),
			});
		});
});
