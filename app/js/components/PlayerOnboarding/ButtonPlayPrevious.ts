import html from '../../utils/html';

export default class ButtonPlayPrevious extends HTMLButtonElement {
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
                class="cnx-color-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path
                    fill="#fff"
                    d="M18 21h3V3h-3v18zM3 21l14-9L3 3v18z"
                    fill-rule="evenodd"
                ></path>
            </svg>
        `;
    }
}

customElements.define('button-play-previous', ButtonPlayPrevious, { extends: 'button' });
