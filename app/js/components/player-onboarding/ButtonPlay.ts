export default class ButtonPlay extends HTMLButtonElement {
    private rendered = false;

    private render(): void {
        this.textContent = 'Play';
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
}

customElements.define('button-play', ButtonPlay, { extends: 'button' });
