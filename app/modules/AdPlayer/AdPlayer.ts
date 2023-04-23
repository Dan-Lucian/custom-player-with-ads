import { adService } from 'services/services';
import { html } from 'utils/generalUtils';
import { IParsedVast } from 'interfaces/IParsedVast';
import { styles } from 'modules/AdPlayer/AdPlayer.styles';
import { ComponentEnum } from 'enums/ComponentEnum';
import 'modules/AdPlayer/components/PlayerAdIframe';
import 'modules/AdPlayer/components/PlayerAdVideo';
import 'modules/AdPlayer/components/PlayerAdIma';
import { AdPlayerAttributeEnum } from 'modules/AdPlayer/enums/AdPlayerAttributeEnum';
import { TAttributeValue } from 'types/TAttributeValue';
import { isNull, isString } from 'utils/typeUtils';

export class AdPlayer extends HTMLElement {
    private isAttached = false;
    private _parsedVast: IParsedVast | null = null;
    private shouldUseIma = false;

    // External property
    set parsedVast(value: IParsedVast) {
        this._parsedVast = value;

        if (!this.isAttached) {
            return;
        }
        this.render();
    }

    public static get observedAttributes(): string[] {
        return [AdPlayerAttributeEnum.UseIma, AdPlayerAttributeEnum.Hidden];
    }

    public async attributeChangedCallback(
        attribute: string,
        oldValue: TAttributeValue,
        newValue: TAttributeValue
    ): Promise<void> {
        if (oldValue === newValue) {
            return;
        }

        switch (attribute) {
            case AdPlayerAttributeEnum.UseIma:
                if (isNull(newValue)) {
                    this.shouldUseIma = false;
                } else {
                    this.shouldUseIma = true;
                }
                return;

            case AdPlayerAttributeEnum.Hidden:
                if (isString(newValue)) {
                    this.cleanupAdPlayer();
                    break;
                }
                break;

            default:
                break;
        }

        if (!this.isAttached) {
            return;
        }
        this.render();
    }

    public connectedCallback(): void {
        if (!this.isAttached) {
            this.render();
            this.isAttached = true;
        }
    }

    private render(): void {
        console.log(`RENDER: <${ComponentEnum.AdPlayer}>`);
        if (isNull(this._parsedVast)) {
            console.log('AdPlayer_parsedVast_is_null');
            return;
        }

        if (this.shouldUseIma || this._parsedVast.isIMAUrl) {
            this.innerHTML = html`
                <style>
                    ${styles}
                </style>

                <player-ad-ima
                    src=${this._parsedVast.mediaLink || adService.getRandomAdUrl()}
                ></player-ad-ima>
            `;

            return;
        }

        this.innerHTML = html`
            <style>
                ${styles}
            </style>

            ${this._parsedVast.isVPAID
                ? html`<player-ad-iframe
                      data-src="${this._parsedVast.mediaLink}"
                  ></player-ad-iframe>`
                : html`<player-ad-video
                      data-src="${this._parsedVast.mediaLink}"
                  ></player-ad-video>`}
        `;
    }

    private cleanupAdPlayer(): void {
        this._parsedVast = null;
    }
}
