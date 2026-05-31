import { IProduct } from '../../types';

export class CatalogModel {
    private items: IProduct[] = [];
    private preview: IProduct | null = null;

    public setItems(items: IProduct[]): void {
        this.items = items;
    }

    public getItems(): IProduct[] {
        return this.items;
    }

    public getItem(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    public setPreview(item: IProduct): void {
        this.preview = item;
    }

    public getPreview(): IProduct | null {
        return this.preview;
    }
}