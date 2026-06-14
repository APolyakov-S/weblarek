import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CartModel {
  private items: IProduct[] = [];

  constructor(protected events: IEvents) {}

addItem(product: IProduct): void {
  if(this.hasItem(product.id)) return;
  this.items.push(product);

  this.events.emit('basket:changed');
};
removeItem(product: IProduct): void {
  this.items = this.items.filter(item => item.id !== product.id);

  this.events.emit('basket:changed');
};
getItemsCount(): number {
  return this.items.length;
};
getItems(): IProduct[] {
  return this.items;
};
getTotalPrice(): number {
  return this.items.reduce((sum, item) => {
    return sum + (item.price ?? 0);
  }, 0);
};
hasItem(productId: string): boolean {
  return this.items.some(item => item.id === productId);
};
clearCart(): void {
  this.items = [];
  
  this.events.emit('basket:changed');
}
}