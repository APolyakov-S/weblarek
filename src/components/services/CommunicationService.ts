import { IApi } from "../../types";
import { IProductResponse } from "../../types";
import { IOrderRequest } from "../../types";
import { IOrderResponse } from "../../types";

export class CommunicationService {
  
  constructor(private api: IApi) {}

  getProducts(): Promise<IProductResponse> {
    return this.api.get<IProductResponse>("/product");
  }

  createOrder(data: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>("/order", data);
  }
}