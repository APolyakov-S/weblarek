import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export abstract class ViewContainer<T> extends Component<T> {
    protected children: Map<string, Component<any>>;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.children = new Map();
    }

    protected addChild(name: string, component: Component<any>): void {
        this.children.set(name, component);
    }

    protected removeChild(name: string): void {
        const component = this.children.get(name);
        if (component) {
            component.container.remove();
            this.children.delete(name);
        }
    }

    protected clearChildren(): void {
        this.children.forEach((component) => {
            component.container.remove();
        });
        this.children.clear();
    }
}