import html from '../../utils/html';

export default class ButtonStop extends HTMLButtonElement {
    private rendered = false;

    private render(): void {
        this.innerHTML = html`
            <svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="#fff" d="M9 21H3V3h6v18zm12 0h-6V3h6v18z" fill-rule="evenodd"></path>
            </svg>
        `;
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
}

customElements.define('button-stop', ButtonStop, { extends: 'button' });