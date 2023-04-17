import { adService } from 'services';
import { html } from 'utils/generalUtils';
import extractInfoFromVastDOM from 'utils/extractInfoFromVastDOM';
import { IVastInfo } from 'interfaces/IVastInfo';
import { styles } from 'components/AdPlayer/AdPlayer.styles';
import { ComponentsEnum } from 'enums/ComponentsEnum';
import 'components/AdPlayer/components/PlayerAdIframe';
import 'components/AdPlayer/components/PlayerAdVideo';
import 'components/AdPlayer/components/PlayerAdIma';

export class AdPlayer extends HTMLElement {
    private rendered = false;
    private vastObj: IVastInfo | null = null;
    private dataUseIma = false;

    public static get observedAttributes(): string[] {
        return ['data-use-ima', 'hidden'];
    }

    public async attributeChangedCallback(
        property: string,
        oldValue: unknown,
        newValue: unknown
    ): Promise<void> {
        if (oldValue === newValue) return;

        switch (property) {
            case 'data-use-ima':
                if (newValue === null) {
                    this.dataUseIma = false;
                } else {
                    this.dataUseIma = true;
                }
                return;

            case 'hidden':
                // if no "hidden" attribute on the component
                if (newValue === null && !this.dataUseIma) {
                    await this.requestAd();
                    break;
                }

                this.cleanupPlayerAd();
                break;

            default:
                break;
        }

        if (!this.rendered) return;
        this.render();
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    private render(): void {
        console.log(`RENDER: <${ComponentsEnum.AdPlayer}>`);
        if (this.dataUseIma) {
            this.innerHTML = html`
                <style>
                    ${styles}
                </style>

                <player-ad-ima src=${adService.getRandomLink()}></player-ad-ima>
            `;

            return;
        }

        this.innerHTML = html`
            <style>
                ${styles}
            </style>

            ${this.vastObj && this.vastObj.isVPAID
                ? html`<player-ad-iframe data-src="${this.vastObj.mediaLink}"></player-ad-iframe>`
                : html`<player-ad-video
                      data-src="${this.vastObj?.mediaLink || ''}"
                  ></player-ad-video>`}
        `;
    }

    private cleanupPlayerAd(): void {
        this.vastObj = null;
    }

    private async requestAd(): Promise<void> {
        const vast = await adService.requestAd();

        const parser = new DOMParser();
        const vastDOM = parser.parseFromString(vast, 'text/xml');

        this.vastObj = extractInfoFromVastDOM(vastDOM);
    }
}
