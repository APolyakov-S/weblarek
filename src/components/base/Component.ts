export abstract class Component<T> {
    constructor(public container: HTMLElement) {}

    protected setImage(element: HTMLImageElement | null, src: string, alt?: string): void {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this, data);
        return this.container;
    }
}