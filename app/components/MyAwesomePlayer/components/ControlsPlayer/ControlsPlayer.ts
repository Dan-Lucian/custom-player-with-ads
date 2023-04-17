import { PlayerEventEnum } from 'enums/PlayerEventEnum';
import './ButtonPlay';
import './ButtonPause';
import './ButtonMute';
import './ButtonUnmute';
import './ButtonLoadAd';
import './ButtonLoadAdIma';
import './ButtonPlayNext';
import './ButtonPlayPrevious';
import './components/MenuSettings';
import html from '../../../../utils/html';

export default class ControlsPlayer extends HTMLElement {
    private isPlaying = false;
    private muted = false;
    private rendered = false;
    private dataQualities = '';

    constructor() {
        super();
        this.addEventListener('click', this.handleClick);
    }

    public static get observedAttributes(): string[] {
        return ['muted', 'autoplay', 'data-qualities'];
    }

    public attributeChangedCallback(property: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) return;

        switch (property) {
            case 'autoplay':
                this.isPlaying = !this.isPlaying;
                break;

            case 'muted':
                this.muted = !this.muted;
                break;

            case 'data-qualities':
                this.dataQualities = String(newValue);
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
        console.log('RENDER: <controls-player>');
        this.innerHTML = html`
            <button class="control-hoverable rotated180" is="button-play-previous"></button>
            ${this.isPlaying
                ? '<button class="control-hoverable" is="button-pause"></button>'
                : '<button class="control-hoverable" is="button-play"></button>'}
            <button class="control-hoverable" is="button-play-next"></button>
            ${this.muted
                ? '<button class="control-hoverable" is="button-unmute"></button>'
                : '<button class="control-hoverable" is="button-mute"></button>'}
            <div class="spacer"></div>
            <menu-settings data-qualities=${this.dataQualities}></menu-settings>
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

        if (is === 'button-play') {
            this.dispatchEvent(
                new CustomEvent(PlayerEventEnum.Play, {
                    bubbles: true,
                    composed: true
                })
            );
            this.isPlaying = true;
            this.render();

            return;
        }

        if (is === 'button-pause') {
            this.dispatchEvent(
                new CustomEvent(PlayerEventEnum.Pause, {
                    bubbles: true,
                    composed: true
                })
            );
            this.isPlaying = false;
            this.render();

            return;
        }

        if (is === 'button-mute') {
            this.dispatchEvent(
                new CustomEvent(PlayerEventEnum.Mute, {
                    bubbles: true,
                    composed: true
                })
            );
            this.muted = true;
            this.render();

            return;
        }

        if (is === 'button-unmute') {
            this.dispatchEvent(
                new CustomEvent(PlayerEventEnum.Unmute, {
                    bubbles: true,
                    composed: true
                })
            );
            this.muted = false;
            this.render();
        }

        if (is === 'button-play-next') {
            this.dispatchEvent(
                new CustomEvent(PlayerEventEnum.PlayNext, {
                    bubbles: true,
                    composed: true
                })
            );
        }

        if (is === 'button-play-previous') {
            this.dispatchEvent(
                new CustomEvent(PlayerEventEnum.PlayPrevious, {
                    bubbles: true,
                    composed: true
                })
            );
        }

        if (is === 'button-load-ad') {
            this.dispatchEvent(
                new CustomEvent(PlayerEventEnum.PlayAd, {
                    bubbles: true,
                    composed: true
                })
            );
        }

        if (is === 'button-load-ad-ima') {
            this.dispatchEvent(
                new CustomEvent(PlayerEventEnum.PlayImaAd, {
                    bubbles: true,
                    composed: true
                })
            );
        }
    }
}

customElements.define('controls-player', ControlsPlayer);
