/* eslint-disable max-len */
import { html } from 'utils/generalUtils';

export class MuteButton extends HTMLButtonElement {
    private isAttached = false;

    public connectedCallback(): void {
        if (!this.isAttached) {
            this.render();
            this.isAttached = true;
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
                    d="M0 7.913v7.913h4.946l5.935 5.045V1.978L4.946 7.913zm16.815 3.957a5.476 5.476 0 00-2.967-4.946v9.9a5.475 5.475 0 002.967-4.945zM13.848 0v2.077a10.39 10.39 0 010 19.585v2.077a12.05 12.05 0 008.9-11.87A12.05 12.05 0 0013.848 0z"
                ></path>
            </svg>
        `;
    }
}
