import { IProduct } from '../../types';

export class CartModel {
    private items: IProduct[] = [];

    public getItems(): IProduct[] {
        return this.items;
    }

    public addItem(item: IProduct): void {
        if (!this.hasItem(item.id)) {
            this.items.push(item);
        }
    }

    public removeItem(itemId: string): void {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    public clear(): void {
        this.items = [];
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