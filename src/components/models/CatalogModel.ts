import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types';

export class CatalogModel {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  constructor(private events: EventEmitter) {}

  public setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalog:changed', { items: this.items });
  }

  public getItems(): IProduct[] {
    return this.items;
  }

  public getItem(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  public setPreview(item: IProduct): void {
    this.preview = item;
    this.events.emit('preview:changed', { preview: this.preview });
  }

  public getPreview(): IProduct | null {
    return this.preview;
  }
}