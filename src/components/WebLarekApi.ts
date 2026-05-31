import { IApi, IProduct, IOrderData, IOrderResult } from '../types';

interface IProductsResponse {
    items: IProduct[];
    total: number;
}

export class WebLarekApi {
    constructor(private api: IApi) {}

    public getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product');
    }

    public postOrder(order: IOrderData): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order', order);
    }
}