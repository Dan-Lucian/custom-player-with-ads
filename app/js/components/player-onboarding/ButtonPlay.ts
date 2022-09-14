import EnumEvents from '../../enums/EnumEvents';

export default class ButtonPlay extends HTMLElement {
    private rendered = false;

    constructor() {
        super();
        this.addEventListener('click', this.play);
    }

    private render(): void {
        this.innerHTML = `<div>I'm a play button</div>`;
    }

    connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    private play(): void {
        console.log('EVENT DISPATCHED: ', EnumEvents.PlayPlayerOnboarding);
        this.dispatchEvent(
            new CustomEvent(EnumEvents.PlayPlayerOnboarding, {
                bubbles: true,
                composed: true
            })
        );
    }
}

customElements.define('button-play', ButtonPlay);
