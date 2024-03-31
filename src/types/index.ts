export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;

	getProductList(): IProduct[];

	getProduct(id: String): IProduct;

	addToCart(id: string): void;
}

export interface IProducts extends IProduct {
	total: number;
	items: IProduct[];
}

export interface IUser {
	method: string;
	phoneNumber: string;
	address: string;
	email: string;

	setPaymentMethod(): string;

	setPhoneNumber(): string;

	setAddress(): string;

	setEmail(): string;

	setUserData(
		payMethod: string,
		phoneNumber: string,
		address: string,
		email: string
	): void;
}

export interface IUserOrder {
	orderProducts(userData: [], orderedItems: []): void;
}

export interface ICard {
	template: HTMLTemplateElement;

	createCard(item: IProduct): HTMLElement;

	render(element: HTMLElement, template: HTMLTemplateElement): HTMLElement;

	addToCart(id: string): void;
}

export interface IModal {
	products: IProduct;

	getPaymentMethod(): string;

	getPhoneNumber(): string;

	getAddress(): string;

	getEmail(): string;

	basicCount: number;

	container: HTMLElement;
	cartItems: IProduct[];
	userData: [];

	openModal(): void;

	closeModal(): void;

	removeFromCart(id: string): IProduct[];

	setCount(id: string): void;

	createModal(
		container: HTMLElement | HTMLFormElement,
		options: Object
	): HTMLElement;

	renderModal(element: HTMLElement): HTMLElement;

	purchase(items: IProduct[], data: Object): void;
}
