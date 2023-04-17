import { EnumEventPlayerAd } from '../../../../enums/AdPlayerEventEnum';
import html from '../../../../utils/html';

export default class ButtonSkipAd extends HTMLButtonElement {
    private rendered = false;

    constructor() {
        super();
        this.addEventListener('click', this.handleClick);
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    private render(): void {
        this.innerHTML = html`Skip ad`;
    }

    private handleClick(): void {
        this.dispatchEvent(
            new CustomEvent(EnumEventPlayerAd.SkipAd, {
                bubbles: true,
                composed: true
            })
        );
    }
}

customElements.define('button-skip-ad', ButtonSkipAd, { extends: 'button' });
