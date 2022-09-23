import { serviceAd } from '../../services';
import html from '../../utils/html';
import extractInfoFromVastDOM from '../../utils/extractInfoFromVastDOM';
import IInfoVast from '../../interfaces/IInfoVast';
import styles from './PlayerAd.styles';
import './PlayerAdIframe';
import './PlayerAdVideo';

export default class PlayerAd extends HTMLElement {
    private rendered = false;
    private vastObj: IInfoVast | null = null;

    public static get observedAttributes(): string[] {
        return ['hidden'];
    }

    public async attributeChangedCallback(
        property: string,
        oldValue: unknown,
        newValue: unknown
    ): Promise<void> {
        if (oldValue === newValue) return;

        switch (property) {
            case 'hidden':
                // if no "hidden" attribute on the component
                if (newValue === null) {
                    await this.requestAd();
                    break;
                }

                this.cleanupPlayerAd();
                break;

            default:
                break;
        }

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

            ${this.vastObj && this.vastObj.isVPAID
                ? html`<player-ad-iframe data-src="${this.vastObj.linkMedia}"></player-ad-iframe>`
                : html`<player-ad-video
                      data-src="${this.vastObj?.linkMedia || ''}"
                  ></player-ad-video>`}
        `;
    }

    private cleanupPlayerAd(): void {
        this.vastObj = null;
    }

    private async requestAd(): Promise<void> {
        const vast = await serviceAd.requestAd();

        const parser = new DOMParser();
        const vastDOM = parser.parseFromString(vast, 'text/xml');

        this.vastObj = extractInfoFromVastDOM(vastDOM);
    }
}

customElements.define('player-ad', PlayerAd);
