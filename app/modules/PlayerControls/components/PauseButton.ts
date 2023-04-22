import { html } from 'utils/generalUtils';

export class PauseButton extends HTMLButtonElement {
    private isAttached = false;

    public connectedCallback(): void {
        if (!this.isAttached) {
            this.render();
            this.isAttached = true;
        }
    }

    private render(): void {
        this.innerHTML = html`
            <svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="#fff" d="M9 21H3V3h6v18zm12 0h-6V3h6v18z" fill-rule="evenodd"></path>
            </svg>
        `;
    }
}
