import { html } from 'utils/generalUtils';
import { AdPlayerEventEnum } from 'enums/AdPlayerEventEnum';
import { styles } from 'modules/AdPlayer/components/AdPlayerControls/AdPlayerControls.styles';
import { TAttributeValue } from 'types/TAttributeValue';
import { isString } from 'utils/typeUtils';
import { ComponentEnum } from 'enums/ComponentEnum';
// eslint-disable-next-line max-len
import { AdPlayerControlsAttributeEnum } from 'modules/AdPlayer/components/AdPlayerControls/enums/AdPlayerControlsAttributeEnum';

export class AdPlayerControls extends HTMLElement {
    private isPlaying = false;
    private isMuted = false;
    private isAttached = false;

    constructor() {
        super();
        this.addEventListener('click', this.handleClick);
    }

    public static get observedAttributes(): string[] {
        return [AdPlayerControlsAttributeEnum.Muted, AdPlayerControlsAttributeEnum.Autoplay];
    }

    public attributeChangedCallback(
        attribute: string,
        oldValue: TAttributeValue,
        newValue: TAttributeValue
    ): void {
        if (oldValue === newValue) {
            return;
        }

        switch (attribute) {
            case AdPlayerControlsAttributeEnum.Muted:
                this.isMuted = isString(newValue);
                break;

            case AdPlayerControlsAttributeEnum.Autoplay:
                this.isPlaying = isString(newValue);
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
        console.log(`RENDER: <${ComponentEnum.AdPlayerControls}>`);
        this.innerHTML = html`
            <style>
                ${styles}
            </style>

            ${this.isPlaying
                ? html`<button
                      class="hoverable-control"
                      is=${ComponentEnum.PauseAdButton}
                  ></button>`
                : html`<button
                      class="hoverable-control"
                      is=${ComponentEnum.PlayAdButton}
                  ></button>`}
            ${this.isMuted
                ? html`<button
                      class="hoverable-control"
                      is=${ComponentEnum.UnmuteAdButton}
                  ></button>`
                : html`<button
                      class="hoverable-control"
                      is=${ComponentEnum.MuteAdButton}
                  ></button>`}
            <div class="spacer"></div>
            <button is=${ComponentEnum.SkipAdButton}></button>
        `;
    }

    private handleClick(event: Event): void {
        const target = event.target as HTMLElement;
        const component = target.closest('[is$="button"]')?.getAttribute('is');

        switch (component) {
            case ComponentEnum.PlayAdButton:
                this.dispatchEvent(
                    new CustomEvent(AdPlayerEventEnum.Play, {
                        bubbles: true
                    })
                );
                this.isPlaying = true;
                this.render();
                break;

            case ComponentEnum.PauseAdButton:
                this.dispatchEvent(
                    new CustomEvent(AdPlayerEventEnum.Pause, {
                        bubbles: true
                    })
                );
                this.isPlaying = false;
                this.render();
                break;

            case ComponentEnum.MuteAdButton:
                this.dispatchEvent(
                    new CustomEvent(AdPlayerEventEnum.Mute, {
                        bubbles: true
                    })
                );
                this.isMuted = true;
                this.render();
                break;

            case ComponentEnum.UnmuteAdButton:
                this.dispatchEvent(
                    new CustomEvent(AdPlayerEventEnum.Unmute, {
                        bubbles: true
                    })
                );
                this.isMuted = false;
                this.render();
                break;

            case ComponentEnum.SkipAdButton:
                this.dispatchEvent(
                    new CustomEvent(AdPlayerEventEnum.SkipAd, {
                        bubbles: true,
                        composed: true
                    })
                );
                break;

            default:
        }
    }
}
