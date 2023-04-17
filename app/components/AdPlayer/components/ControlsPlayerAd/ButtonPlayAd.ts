import { html } from '../../../../utils/generalUtils';

export default class ButtonPlayAd extends HTMLButtonElement {
    private rendered = false;

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    private render(): void {
        this.innerHTML = html`
            <svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="#fff" d="M5 4v16l16-8z" fill-rule="evenodd"></path>
            </svg>
        `;
    }
}

customElements.define('button-play-ad', ButtonPlayAd, { extends: 'button' });
