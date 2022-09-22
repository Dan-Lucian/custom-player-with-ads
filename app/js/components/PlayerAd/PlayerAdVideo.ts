import html from '../../utils/html';
import styles from './PlayerAdVideo.styles';
import './ButtonSkipAd';

export default class PlayerAdVideo extends HTMLElement {
    private rendered = false;

    public static get observedAttributes(): string[] {
        return ['hidden'];
    }

    public static get videoElement(): Element | null {
        return document.getElementsByTagName('player-ad')[0] || null;
    }

    public async attributeChangedCallback(
        property: string,
        oldValue: unknown,
        newValue: unknown
    ): Promise<void> {
        if (oldValue === newValue) return;

        this.render();
    }

    public async connectedCallback(): Promise<void> {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    private render(): void {
        this.innerHTML = html`
            <style>
                ${styles}
            </style>

            <video id="player-ad" preload="metadata">Player not supported</video>
            <button is="button-skip-ad"></button>
        `;
    }
}

customElements.define('player-ad-video', PlayerAdVideo);
