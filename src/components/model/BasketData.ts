import { IBasketData, IProduct } from '../../types';
import { removeItem } from '../../utils/utils';
import { Model } from '../base/Model';

export class BasketData extends Model<IBasketData> {
	basket: IProduct[] = [];

	addToBasket(item: IProduct) {
		if (item.price) {
			this.basket.push(item);
			this.emitChanges('basket-count:change', this.basket);
			this.emitChanges('basket:change', this.basket);
		}
	}

	deleteFromBasket(item: IProduct) {
		removeItem(this.basket, item);
		this.emitChanges('basket-count:change', this.basket);
		this.emitChanges('basket:change', this.basket);
	}

	fullClearBasket() {
		this.basket = [];
		this.emitChanges('basket-count:change', this.basket);
		this.emitChanges('basket:change', this.basket);
	}
}
