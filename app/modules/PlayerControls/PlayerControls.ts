import {
    addEventListenersUsingArray,
    html,
    removeEventListenersUsingArray
} from 'utils/generalUtils';
import { ComponentEnum } from 'enums/ComponentEnum';
import { PlayerEventEnum } from 'enums/PlayerEventEnum';
import { PlayerControlsAttributeEnum } from 'modules/PlayerControls/enums/PlayerControlsAttributeEnum';
import { isNull, isString } from 'utils/typeUtils';
import { TAttributeValue } from 'types/TAttributeValue';
// eslint-disable-next-line max-len
import { SettingsMenuAttributeEnum } from 'modules/PlayerControls/components/SettingsMenu/enums/SettingsMenuAttributeEnum';
import { SoundSliderAttributeEnum } from 'modules/PlayerControls/components/SoundSlider/enums/SoundSliderAttributeEnum';
import { SoundSliderEventEnum } from 'modules/PlayerControls/components/SoundSlider/enums/SoundSliderEventEnum';
import { IEventListener } from 'interfaces/IEventListener';
import { IVolumeChangeDetail } from 'interfaces/IVolumeChangeDetail';

export class PlayerControls extends HTMLElement {
    private isPlaying = false;
    private isMuted = false;
    private isAttached = false;
    private volume = 1;
    private streamingQualities: string | null = null;
    private eventListeners: IEventListener[] = [];

    public static get observedAttributes(): string[] {
        return [
            PlayerControlsAttributeEnum.Muted,
            PlayerControlsAttributeEnum.Autoplay,
            PlayerControlsAttributeEnum.Qualities,
            PlayerControlsAttributeEnum.Volume
        ];
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
            case PlayerControlsAttributeEnum.Autoplay:
                if (isString(newValue)) {
                    this.isPlaying = true;
                } else {
                    this.isPlaying = false;
                }
                break;

            case PlayerControlsAttributeEnum.Muted:
                if (isString(newValue)) {
                    this.isMuted = true;
                } else {
                    this.isMuted = false;
                }
                break;

            case PlayerControlsAttributeEnum.Qualities:
                this.streamingQualities = newValue;
                break;

            case PlayerControlsAttributeEnum.Volume:
                if (isString(newValue)) {
                    this.volume = parseInt(newValue, 10);
                } else {
                    this.volume = 1;
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
            this.addEventListeners();
        }
    }

    public disconnectedCallback(): void {
        this.isAttached = false;
        this.removeEventListeners();
    }

    private render(): void {
        console.log(`RENDER: <${ComponentEnum.PlayerControls}>`);
        const qualities = isNull(this.streamingQualities) ? '' : this.streamingQualities;

        this.innerHTML = html`
            <button
                class="hoverable-control rotated180"
                is=${ComponentEnum.PlayPreviousButton}
            ></button>
            ${this.isPlaying
                ? html`<button class="hoverable-control" is=${ComponentEnum.PauseButton}></button>`
                : html`<button class="hoverable-control" is=${ComponentEnum.PlayButton}></button>`}
            <button class="hoverable-control" is=${ComponentEnum.PlayNextButton}></button>
            ${this.isMuted
                ? html`<button class="hoverable-control" is=${ComponentEnum.UnmuteButton}></button>`
                : html`<button class="hoverable-control" is=${ComponentEnum.MuteButton}></button>`}
            <sound-slider ${SoundSliderAttributeEnum.Volume}=${this.volume}></sound-slider>
            <div class="spacer"></div>
            <settings-menu ${SettingsMenuAttributeEnum.Qualities}=${qualities}></settings-menu>
        `;
    }

    private addEventListeners(): void {
        const soundSliderElement = this.getElementsByTagName(
            ComponentEnum.SoundSlider
        )[0] as HTMLElement;
        console.log('soundSliderElement: ', soundSliderElement);

        this.eventListeners.push(
            {
                element: this,
                event: SoundSliderEventEnum.VolumeChange,
                callback: this.handleVolumeChange.bind(this)
            },
            {
                element: this,
                event: 'click',
                callback: this.handleClick.bind(this)
            }
        );
        addEventListenersUsingArray(this.eventListeners);
    }

    private removeEventListeners(): void {
        removeEventListenersUsingArray(this.eventListeners);
    }

    private handleClick(event: Event): void {
        const target = event.target as HTMLElement;
        const component = target.closest('[is$="button"]')?.getAttribute('is');

        switch (component) {
            case ComponentEnum.PlayButton:
                console.log('PLAY: ');
                this.dispatchEvent(
                    new CustomEvent(PlayerEventEnum.Play, {
                        bubbles: true,
                        composed: true
                    })
                );
                this.isPlaying = true;
                this.render();
                break;

            case ComponentEnum.PauseButton:
                this.dispatchEvent(
                    new CustomEvent(PlayerEventEnum.Pause, {
                        bubbles: true,
                        composed: true
                    })
                );
                this.isPlaying = false;
                this.render();
                break;

            case ComponentEnum.MuteButton:
                this.dispatchEvent(
                    new CustomEvent(PlayerEventEnum.Mute, {
                        bubbles: true,
                        composed: true
                    })
                );
                this.isMuted = true;
                this.render();
                break;

            case ComponentEnum.UnmuteButton:
                this.dispatchEvent(
                    new CustomEvent(PlayerEventEnum.Unmute, {
                        bubbles: true,
                        composed: true
                    })
                );
                this.isMuted = false;
                this.render();
                break;

            case ComponentEnum.PlayNextButton:
                this.dispatchEvent(
                    new CustomEvent(PlayerEventEnum.PlayNext, {
                        bubbles: true,
                        composed: true
                    })
                );
                break;

            case ComponentEnum.PlayPreviousButton:
                this.dispatchEvent(
                    new CustomEvent(PlayerEventEnum.PlayPrevious, {
                        bubbles: true,
                        composed: true
                    })
                );
                break;

            default:
        }
    }

    private handleVolumeChange(event: Event): void {
        const customEvent = event as CustomEvent<IVolumeChangeDetail>;
        const { volume } = customEvent.detail;
        this.volume = volume;

        this.dispatchEvent(
            new CustomEvent<IVolumeChangeDetail>(PlayerEventEnum.VolumeChange, {
                bubbles: true,
                composed: true,
                detail: { volume }
            })
        );
    }
}
