import 'modules/PlayerControls/components/ButtonPlay';
import 'modules/PlayerControls/components/ButtonPause';
import 'modules/PlayerControls/components/ButtonMute';
import 'modules/PlayerControls/components/ButtonUnmute';
import 'modules/PlayerControls/components/ButtonLoadAd';
import 'modules/PlayerControls/components/ButtonLoadAdIma';
import 'modules/PlayerControls/components/ButtonPlayNext';
import 'modules/PlayerControls/components/ButtonPlayPrevious';
import 'modules/PlayerControls/components/MenuSettings/MenuSettings';
import { html } from 'utils/generalUtils';
import { ComponentEnum } from 'enums/ComponentEnum';
import { PlayerEventEnum } from 'enums/PlayerEventEnum';
import { PlayerControlsAttributeEnum } from 'modules/PlayerControls/PlayerControlsAttributeEnum';
import { isNull, isString } from 'utils/typeUtils';
import { TAttributeValue } from 'types/TAttributeValue';

export class PlayerControls extends HTMLElement {
    private isPlaying = false;
    private isMuted = false;
    private isAttached = false;
    private streamingQualities: string | null = null;

    constructor() {
        super();
        this.addEventListener('click', this.handleClick);
    }

    public static get observedAttributes(): string[] {
        return [
            PlayerControlsAttributeEnum.Muted,
            PlayerControlsAttributeEnum.Autoplay,
            PlayerControlsAttributeEnum.Qualities
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

    public disconnectedCallback(): void {
        this.isAttached = false;
    }

    private render(): void {
        console.log(`RENDER: ${ComponentEnum.PlayerControls}`);
        const qualitiesAttributeValue = isNull(this.streamingQualities)
            ? ''
            : this.streamingQualities;

        this.innerHTML = html`
            <button class="control-hoverable rotated180" is="button-play-previous"></button>
            ${this.isPlaying
                ? html`<button class="control-hoverable" is="button-pause"></button>`
                : html`<button class="control-hoverable" is="button-play"></button>`}
            <button class="control-hoverable" is="button-play-next"></button>
            ${this.isMuted
                ? html`<button class="control-hoverable" is="button-unmute"></button>`
                : html`<button class="control-hoverable" is="button-mute"></button>`}
            <div class="spacer"></div>
            <menu-settings data-qualities=${qualitiesAttributeValue}></menu-settings>
            <button class="control-hoverable" is="button-load-ad" title="load ad"></button>
            <button
                class="control-hoverable"
                is="button-load-ad-ima"
                title="load ad through ima"
            ></button>
        `;
    }

    private handleClick(event: Event): void {
        const target = event.target as HTMLElement;
        const is = target.closest('[is|="button"]')?.getAttribute('is');

        switch (is) {
            case ComponentEnum.PlayButton:
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

            case ComponentEnum.LoadAdButton:
                this.dispatchEvent(
                    new CustomEvent(PlayerEventEnum.PlayAd, {
                        bubbles: true,
                        composed: true
                    })
                );
                break;

            case ComponentEnum.LoadImaAdButton:
                this.dispatchEvent(
                    new CustomEvent(PlayerEventEnum.PlayImaAd, {
                        bubbles: true,
                        composed: true
                    })
                );
                break;

            default:
        }
    }
}
