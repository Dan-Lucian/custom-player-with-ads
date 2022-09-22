import EnumEventPlayer from '../../enums/EnumEventPlayer';
import './ButtonPlay';
import './ButtonLoadAd';
import './ButtonPause';
import './ButtonMute';
import './ButtonUnmute';
import html from '../../utils/html';

export default class ControlsPlayer extends HTMLElement {
    private isPlaying = false;
    private muted = false;
    private rendered = false;

    constructor() {
        super();
        this.addEventListener('click', this.handleClick);
    }

    public static get observedAttributes(): string[] {
        return ['muted', 'autoplay'];
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

            default:
                break;
        }

        this.render();
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    private render(): void {
        this.innerHTML = html`
            ${this.isPlaying
                ? '<button class="control-hoverable" is="button-pause"></button>'
                : '<button class="control-hoverable" is="button-play"></button>'}
            ${this.muted
                ? '<button class="control-hoverable" is="button-unmute"></button>'
                : '<button class="control-hoverable" is="button-mute"></button>'}
            <div class="spacer"></div>
            <button class="control-hoverable" is="button-load-ad"></button>
        `;
    }

    private handleClick(event: Event): void {
        const target = event.target as HTMLElement;
        const is = target.closest('[is|="button"]')?.getAttribute('is');

        if (is === 'button-play') {
            this.dispatchEvent(
                new CustomEvent(EnumEventPlayer.PlayPlayerOnboarding, {
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
                new CustomEvent(EnumEventPlayer.PausePlayerOnboarding, {
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
                new CustomEvent(EnumEventPlayer.MutePlayerOnboarding, {
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
                new CustomEvent(EnumEventPlayer.UnmutePlayerOnboarding, {
                    bubbles: true,
                    composed: true
                })
            );
            this.muted = false;
            this.render();
        }

        if (is === 'button-load-ad') {
            this.dispatchEvent(
                new CustomEvent(EnumEventPlayer.PlayAdPlayerOnboarding, {
                    bubbles: true,
                    composed: true
                })
            );
        }
    }
}

customElements.define('controls-player', ControlsPlayer);
