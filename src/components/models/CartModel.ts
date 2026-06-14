import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types';

export class CartModel {
    private items: IProduct[] = [];

    constructor(private events: EventEmitter) {}

    public getItems(): IProduct[] {
        return this.items;
    }

    public getCount(): number {
        return this.items.length;
    }

    public getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    public hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }

    public addItem(item: IProduct): void {
        if (!this.hasItem(item.id)) {
            this.items.push(item);
            this.events.emit('basket:changed', this.items);
        }
    }

    public removeItem(id: string): void {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.id !== id);
        if (initialLength !== this.items.length) {
            this.events.emit('basket:changed', this.items);
        }
    }

    public clear(): void {
        this.items = [];
        this.events.emit('basket:changed', this.items);
    }
}