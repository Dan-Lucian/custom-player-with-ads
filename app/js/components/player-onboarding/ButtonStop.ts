import EnumEvents from '../../enums/EnumEvents';

export default class ButtonStop extends HTMLElement {
    private rendered = false;

    constructor() {
        super();
        this.addEventListener('click', this.stop);
    }

    private render(): void {
        this.innerHTML = `<div>I'm a stop button</div>`;
    }

    connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    private stop(): void {
        console.log('EVENT DISPATCHED: ', EnumEvents.StopPlayerOnboarding);
        this.dispatchEvent(
            new CustomEvent(EnumEvents.StopPlayerOnboarding, {
                bubbles: true,
                composed: true
            })
        );
    }
}

customElements.define('button-stop', ButtonStop);
