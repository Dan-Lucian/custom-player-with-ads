import { html } from 'utils/generalUtils';

export class LoadImaAdButton extends HTMLButtonElement {
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
                <path fill="#ff2200" d="M5 4v16l16-8z" fill-rule="evenodd"></path>
            </svg>
        `;
    }
}
