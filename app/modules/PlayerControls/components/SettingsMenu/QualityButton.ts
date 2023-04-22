import { html } from 'utils/generalUtils';

export class QualityButton extends HTMLButtonElement {
    private isAttached = false;
    private quality = '';

    public static get observedAttributes(): string[] {
        return ['data-quality'];
    }

    public attributeChangedCallback(property: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) {
            return;
        }

        switch (property) {
            case 'data-quality':
                this.quality = String(newValue);
                break;

            default:
                break;
        }

        if (!this.isAttached) {
            return;
        }
        this.render();
    }

    public connectedCallback(): void {
        if (!this.isAttached) {
            this.render();
            this.isAttached = true;
        }
    }

    private render(): void {
        this.innerHTML = html`${this.quality}`;
    }
}
