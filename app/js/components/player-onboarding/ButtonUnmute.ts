export default class ButtonUnmute extends HTMLButtonElement {
    private rendered = false;

    private render(): void {
        this.textContent = 'Ummute';
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
}

customElements.define('button-unmute', ButtonUnmute, { extends: 'button' });
