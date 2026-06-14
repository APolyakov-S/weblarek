import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Page extends Component<{ catalog: HTMLElement[] }> {
    private galleryElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.galleryElement = ensureElement('.gallery', this.container);
    }

    setCatalog(items: HTMLElement[]): void {
        this.galleryElement.replaceChildren(...items);
    }

    render(data?: { catalog: HTMLElement[] }): HTMLElement {
        if (data?.catalog) {
            this.setCatalog(data.catalog);
        }
        return this.container;
    }
}