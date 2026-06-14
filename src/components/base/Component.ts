export abstract class Component<T> {
    constructor(public container: HTMLElement) {}

    protected setText(element: HTMLElement | null, value: string): void {
        if (element) {
            element.textContent = value;
        }
    }

    protected setImage(element: HTMLImageElement | null, src: string, alt?: string): void {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    protected setDisabled(element: HTMLElement | null, state: boolean): void {
        if (element) {
            if (state) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
        }
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this, data);
        return this.container;
    }
}