/* eslint-disable class-methods-use-this */
import { html } from 'utils/generalUtils';
import { ExternalButtonsAttributeEnum } from 'modules/ExternalButtons/enums/ExternalButtonsAttributeEnum';
import { TAttributeValue } from 'types/TAttributeValue';
import { isDefined, isNull, isString } from 'utils/typeUtils';
import { styles } from 'modules/ExternalButtons/ExternalButtons.styles';
import { ComponentEnum } from 'enums/ComponentEnum';
import { PlayerEventEnum } from 'enums/PlayerEventEnum';
import { MyAwesomePlayer } from 'modules/MyAwesomePlayer/MyAwesomePlayer';
import { IPlayAdDetail } from 'interfaces/IPlayAdDetail';
import { IMA_AD_URL, VIDEO_AD_URL, VPAID_AD_URL } from 'mocks/adUrls';
import { ImaEventEnum } from 'modules/ImaLoader/enums/ImaEventEnum';
import { IErrorDetail } from 'interfaces/IErrorDetail';
import { PlayerErrorEnum } from 'enums/PlayerErrorEnum';

type EventType = PlayerEventEnum | ImaEventEnum;

export class ExternalButtons extends HTMLElement {
    private isAttached = false;
    private areButttonsDisabled = false;
    private error: string | null = null;
    private subscriptions?: Map<EventType, (event: Event) => void>;

    constructor() {
        super();
        this.addEventListener('click', this.handleClick);
    }

    public static get observedAttributes(): string[] {
        return [ExternalButtonsAttributeEnum.Disabled, ExternalButtonsAttributeEnum.Error];
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
            case ExternalButtonsAttributeEnum.Disabled:
                this.areButttonsDisabled = isString(newValue);
                break;

            case ExternalButtonsAttributeEnum.Error:
                this.error = isString(newValue) ? newValue : null;
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
            this.subscribeToPlayerEvents();
        }
    }

    public disconnectedCallback(): void {
        this.isAttached = false;
        this.unsubscribeToPlayerEvents();
    }

    private subscribeToPlayerEvents(): void {
        this.subscriptions = new Map<EventType, (event: Event) => void>([
            [PlayerEventEnum.PlayAd, this.handlePlayAd.bind(this)],
            [PlayerEventEnum.SkipAd, this.handleEndAd.bind(this)],
            [PlayerEventEnum.EndAd, this.handleEndAd.bind(this)],
            [PlayerEventEnum.Error, this.handleError.bind(this)],
            [ImaEventEnum.AdSkip, this.handleEndAd.bind(this)],
            [ImaEventEnum.AdEnd, this.handleEndAd.bind(this)]
        ]);

        const player = this.getPlayer();
        this.subscriptions.forEach((callback, event) => {
            player.addEventListener(event, callback);
        });
    }

    private unsubscribeToPlayerEvents(): void {
        if (!isDefined(this.subscriptions)) {
            return;
        }

        const player = this.getPlayer();
        this.subscriptions.forEach((callback, event) => {
            player.removeEventListener(event, callback);
        });
    }

    private getPlayer(): MyAwesomePlayer {
        return document.getElementsByTagName(ComponentEnum.MyAwesomePlayer)[0] as MyAwesomePlayer;
    }

    private render(): void {
        const disabledAttribute = this.areButttonsDisabled
            ? ExternalButtonsAttributeEnum.Disabled
            : '';

        this.innerHTML = html`
            <style>
                ${styles}
            </style>

            ${!isNull(this.error)
                ? html`<div class="external-buttons-error">${this.error}</div>`
                : ''}
            ${disabledAttribute ? html`<div class="ad-is-playing">An ad is playing</div>` : ''}

            <div>
                <button ${disabledAttribute} id="play-video-ad-external-button">
                    Play video ad
                </button>
                <button ${disabledAttribute} id="play-vpaid-ad-external-button">
                    Play VPAID ad
                </button>
                <button ${disabledAttribute} id="play-ima-ad-external-button">Play IMA ad</button>
            </div>
        `;
    }

    private handleClick(event: Event): void {
        this.removeAttribute(ExternalButtonsAttributeEnum.Error);
        const buttonId = (event.target as HTMLElement).id;
        const myAwesomePlayer = document.getElementsByTagName(
            ComponentEnum.MyAwesomePlayer
        )[0] as MyAwesomePlayer;

        switch (buttonId) {
            case 'play-video-ad-external-button':
                this.handlePlayAd();
                myAwesomePlayer.playAd(
                    new CustomEvent<IPlayAdDetail>(PlayerEventEnum.PlayAd, {
                        bubbles: true,
                        composed: true,
                        detail: {
                            shouldUseIma: false,
                            url: VIDEO_AD_URL
                        }
                    })
                );
                break;

            case 'play-vpaid-ad-external-button':
                this.handlePlayAd();
                myAwesomePlayer.playAd(
                    new CustomEvent<IPlayAdDetail>(PlayerEventEnum.PlayAd, {
                        bubbles: true,
                        composed: true,
                        detail: {
                            shouldUseIma: false,
                            url: VPAID_AD_URL
                        }
                    })
                );
                break;

            case 'play-ima-ad-external-button':
                this.handlePlayAd();
                myAwesomePlayer.playAd(
                    new CustomEvent<IPlayAdDetail>(PlayerEventEnum.PlayAd, {
                        bubbles: true,
                        composed: true,
                        detail: {
                            shouldUseIma: false,
                            url: IMA_AD_URL
                        }
                    })
                );
                break;

            default:
        }
    }

    private handlePlayAd(): void {
        this.setAttribute(ExternalButtonsAttributeEnum.Disabled, '');
    }

    private handleEndAd(): void {
        this.removeAttribute(ExternalButtonsAttributeEnum.Disabled);
    }

    private handleError(event: Event): void {
        const customEvent = event as CustomEvent<IErrorDetail>;
        const { error } = customEvent.detail;

        switch (error) {
            case PlayerErrorEnum.AttemptAdPlayDuringPause:
                this.setAttribute(
                    ExternalButtonsAttributeEnum.Error,
                    `Ads can't run if the player is paused`
                );
                this.removeAttribute(ExternalButtonsAttributeEnum.Disabled);
                break;

            default:
        }
    }
}
