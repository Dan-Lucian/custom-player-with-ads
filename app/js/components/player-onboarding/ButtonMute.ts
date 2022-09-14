export default class ButtonMute extends HTMLElement {
    private rendered = false;

    private render(): void {
        this.innerHTML = `<button type="button">Mute</button>`;
    }

    connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
}

customElements.define('button-mute', ButtonMute);
