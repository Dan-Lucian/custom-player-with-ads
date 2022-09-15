import html from '../../utils/html';
import styles from './FormPlayer.styles';

export default class FormPlayer extends HTMLFormElement {
    private rendered = false;

    static get videoElement(): Element | null {
        return document.getElementsByTagName('player-onboarding')[0] || null;
    }

    constructor() {
        super();
        this.addEventListener('submit', FormPlayer.handleSubmit);
    }

    private render(): void {
        this.innerHTML = html`
            <style>
              ${styles}
            </style>

            <label for="input-src">Video link:</label>
            <input type="text" id="input-src" name="src"></input>
            
            <label for="input-width">Width:</label>
            <input type="number" id="input-width" name="width"></input>

            <label for="input-autoplay">Autoplay</label>
            <input type="checkbox" id="input-autoplay" name="autoplay"></input>
            
            <label for="input-muted">Muted:</label>
            <input type="checkbox" id="input-muted" name="muted"></input>

            <button type="submit">Load</button>
        `;
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    static handleSubmit(event: Event): void {
        event.preventDefault();

        const dataFromForm = new FormData(event.target as HTMLFormElement);

        const src = String(dataFromForm.get('src'));
        const width = String(dataFromForm.get('width'));
        const autoplay = Boolean(dataFromForm.get('autoplay'));
        const muted = Boolean(dataFromForm.get('muted'));

        if (src) {
            FormPlayer.videoElement?.setAttribute('src', src);
        }

        if (width) {
            FormPlayer.videoElement?.setAttribute('width', width);
        }

        if (autoplay) {
            FormPlayer.videoElement?.setAttribute('autoplay', '');
        } else {
            FormPlayer.videoElement?.removeAttribute('autoplay');
        }

        if (muted) {
            FormPlayer.videoElement?.setAttribute('muted', '');
        } else {
            FormPlayer.videoElement?.removeAttribute('muted');
        }
    }
}

customElements.define('form-player', FormPlayer, { extends: 'form' });
