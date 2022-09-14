export default class ButtonUnmute extends HTMLElement {
    private rendered = false;

    private render(): void {
        this.innerHTML = `<button type="button">Unmute</button>`;
    }

    connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
}

customElements.define('button-unmute', ButtonUnmute);
