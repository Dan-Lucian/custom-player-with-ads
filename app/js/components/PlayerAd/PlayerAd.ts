import { serviceAd } from '../../services';
import html from '../../utils/html';
import styles from './PlayerAd.styles';
import './ButtonSkip';

export default class PlayerAd extends HTMLElement {
    private rendered = false;

    private vast?: Document;

    static get videoElement(): Element | null {
        return document.getElementsByTagName('player-ad')[0] || null;
    }

    static get observedAttributes(): string[] {
        return ['src', 'width', 'muted', 'autoplay'];
    }

    private render(): void {
        this.innerHTML = html`
            <style>
                ${styles}
            </style>

            <video id="player-ad" preload="metadata">Player not supported</video>
            <button is="button-skip"></button>
        `;
    }

    public async connectedCallback(): Promise<void> {
        if (!this.rendered) {
            this.render();
            this.rendered = true;

            this.vast = await PlayerAd.requestAd();
        }
    }

    public attributeChangedCallback(property: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) return;

        this.render();
    }

    static async requestAd(): Promise<Document> {
        const vast = await serviceAd.requestAd();

        const parser = new DOMParser();
        return parser.parseFromString(vast, 'text/xml');
    }
}

customElements.define('player-ad', PlayerAd);
