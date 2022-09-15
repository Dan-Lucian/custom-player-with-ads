import html from '../../utils/html';
import styles from './FormPlayer.styles';

export default class FormPlayer extends HTMLFormElement {
    private rendered = false;

    static get videoElement(): Element | null {
        return document.getElementsByTagName('player-onboarding')[0] || null;
    }

    constructor() {
        super();
        this.addEventListener('submit', this.handleSubmit);
    }

    private render(): void {
        this.innerHTML = html`
          <style>
            ${styles}
          </style>

          <label for="input-src">Video link:</label>
          <input type="text" id="input-src"></input>
          <button type="submit">Load</button>
        `;
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    private handleSubmit(event: Event): void {
        event.preventDefault();
        console.log('event: submit');
        console.log('videoElement: ', FormPlayer.videoElement);
    }
}

customElements.define('form-player', FormPlayer, { extends: 'form' });
