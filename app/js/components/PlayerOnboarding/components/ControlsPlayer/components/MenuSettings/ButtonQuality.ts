import html from '../../../../../../utils/html';

export default class ButtonQuality extends HTMLButtonElement {
    private rendered = false;
    private quality = '';

    public static get observedAttributes(): string[] {
        return ['data-quality'];
    }

    public attributeChangedCallback(property: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) return;

        switch (property) {
            case 'data-quality':
                this.quality = String(newValue);
                break;

            default:
                break;
        }

        if (!this.rendered) return;
        this.render();
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    private render(): void {
        this.innerHTML = html`${this.quality}`;
    }
}

customElements.define('button-quality', ButtonQuality, { extends: 'button' });
