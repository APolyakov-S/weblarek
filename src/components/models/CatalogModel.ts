import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class CatalogModel {
    private items: IProduct[] = [];
    private preview: IProduct | null = null;

    constructor(private events: EventEmitter) {}

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('catalog:changed', this.items);
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setPreview(item: IProduct): void {
        this.preview = item;
        this.events.emit('preview:changed', item);
    }

    getPreview(): IProduct | null {
        return this.preview;
    }
}