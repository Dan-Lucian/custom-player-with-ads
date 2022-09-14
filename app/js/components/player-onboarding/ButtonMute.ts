export default class ButtonMute extends HTMLButtonElement {
    private rendered = false;

    private render(): void {
        this.textContent = 'Mute';
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
}

customElements.define('button-mute', ButtonMute, { extends: 'button' });
