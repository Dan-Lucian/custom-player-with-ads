import html from '../../utils/html';

export default class ButtonSkip extends HTMLButtonElement {
    private rendered = false;

    private render(): void {
        this.innerHTML = html`Skip ad`;
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
}

customElements.define('button-skip', ButtonSkip, { extends: 'button' });
