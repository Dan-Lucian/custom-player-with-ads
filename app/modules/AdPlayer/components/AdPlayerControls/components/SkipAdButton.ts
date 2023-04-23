import { html } from 'utils/generalUtils';

export class SkipAdButton extends HTMLButtonElement {
    private isAttached = false;

    public connectedCallback(): void {
        if (!this.isAttached) {
            this.render();
            this.isAttached = true;
        }
    }

    private render(): void {
        this.innerHTML = html`Skip ad`;
    }
}
