export default class ButtonStop extends HTMLElement {
    private rendered = false;

    private render(): void {
        this.innerHTML = `<button type="button">Stop</button>`;
    }

    connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
}

customElements.define('button-stop', ButtonStop);
