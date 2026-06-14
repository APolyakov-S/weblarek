import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class BasketModel {
    private items: IProduct[] = [];

    constructor(private events: EventEmitter) {}

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        if (item.price === null) {
            return;
        }
        
        if (!this.hasItem(item.id)) {
            this.items.push(item);
            this.events.emit('basket:changed', this.items);
        }
    }

    removeItem(itemId: string): void {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.id !== itemId);
        
        if (initialLength !== this.items.length) {
            this.events.emit('basket:changed', this.items);
        }
    }

    clear(): void {
        this.items = [];
        this.events.emit('basket:changed', this.items);
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}