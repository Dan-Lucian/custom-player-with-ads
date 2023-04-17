import { html } from '../../../../utils/generalUtils';

export default class ButtonUnmuteAd extends HTMLButtonElement {
    private rendered = false;

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    private render(): void {
        this.innerHTML = html`
            <svg
                width="24px"
                height="24px"
                markup-inline=""
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path
                    fill="#fff"
                    d="M11 2L8.25 4.25 11 7zM0 7v9h5l6 5v-6.5L3.85 7zm17 4.5c0-1.965-1.2-3.735-3-4.5v3l2.8 2.8a3.73 3.73 0 00.2-1.3zm3.4 7.45l-1.85-1.85-2.65-2.6-1.9-1.95-3-3-4.15-4.1-4.95-5L1.45 0 0 1.45 17.15 18.6 19 20.4l3.55 3.6L24 22.55zM14 23a11.83 11.83 0 003.65-1.55l-1.25-1.3c-.747.498-1.553.902-2.4 1.2V23zm9-11.5A11.77 11.77 0 0014 0v1.6A10.53 10.53 0 0120 16l1.45 1.45A11.99 11.99 0 0023 11.5z"
                ></path>
            </svg>
        `;
    }
}

customElements.define('button-unmute-ad', ButtonUnmuteAd, { extends: 'button' });
