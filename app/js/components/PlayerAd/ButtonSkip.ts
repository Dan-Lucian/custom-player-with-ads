import EnumEvents from '../../enums/EnumEvents';
import html from '../../utils/html';

export default class ButtonSkip extends HTMLButtonElement {
    private rendered = false;

    constructor() {
        super();
        this.addEventListener('click', this.handleClick);
    }

    private render(): void {
        this.innerHTML = html`Skip ad`;
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    private handleClick(): void {
        this.dispatchEvent(
            new CustomEvent(EnumEvents.SkipAd, {
                bubbles: true,
                composed: true
            })
        );
    }
}

customElements.define('button-skip', ButtonSkip, { extends: 'button' });
