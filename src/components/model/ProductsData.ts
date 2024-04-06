import { IProduct, IProductsData } from '../../types';
import { Model } from '../base/Model';

export class ProductsData extends Model<IProductsData> {
	productList: IProduct[];
	preview: string | null;

	setProductList(data: IProduct[]): void {
		this.productList = data;
		this.emitChanges('items:changed');
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}
}
