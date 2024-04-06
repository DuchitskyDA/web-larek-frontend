import { IOrder, IOrderForm, IOrderResult, IProduct } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface IAppAPI {
	getProductItem: () => Promise<IProduct[]>;
	order: (order: IOrderForm) => Promise<IOrderResult>;
}

export class AppApi extends Api implements IAppAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);

		this.cdn = cdn;
	}

	getProductItem(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	order(order: IOrder & IOrderForm): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
