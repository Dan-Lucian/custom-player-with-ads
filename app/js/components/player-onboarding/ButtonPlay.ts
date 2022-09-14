export default class ButtonPlay extends HTMLElement {
    private rendered = false;

    private render(): void {
        this.innerHTML = `<button type="button">Play</button>`;
    }

    connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
}

customElements.define('button-play', ButtonPlay);
