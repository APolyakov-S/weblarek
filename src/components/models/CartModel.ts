import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types';

export class CartModel {
  private items: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  public getItems(): IProduct[] {
    return this.items;
  }

  public addItem(item: IProduct): void {
    const exists = this.items.some(i => i.id === item.id);
    if (!exists) {
      this.items.push(item);
      this.events.emit('cart:changed', this.items);
    }
  }

  public removeItem(itemId: string): void {
    this.items = this.items.filter(item => item.id !== itemId);
    this.events.emit('cart:changed', this.items);
  }

  public clear(): void {
    this.items = [];
    this.events.emit('cart:changed', this.items);
  }

  public getTotal(): number {
    return this.items.reduce((sum, item) => {
      return sum + (item.price ?? 0);
    }, 0);
  }

  public getCount(): number {
    return this.items.length;
  }

  public hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}