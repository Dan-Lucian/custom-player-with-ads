export default class ButtonStop extends HTMLButtonElement {
    private rendered = false;

    private render(): void {
        this.textContent = 'Stop';
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
}

customElements.define('button-stop', ButtonStop, { extends: 'button' });
