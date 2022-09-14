export default class ButtonMute extends HTMLButtonElement {
    private rendered = false;

    private render(): void {
        this.textContent = 'Mute';
    }

    connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
}

customElements.define('button-mute', ButtonMute, { extends: 'button' });
