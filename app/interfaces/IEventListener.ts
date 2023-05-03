export interface IEventListener<T = string> {
    element: HTMLElement;
    event: T;
    callback: (event: Event) => void;
}
