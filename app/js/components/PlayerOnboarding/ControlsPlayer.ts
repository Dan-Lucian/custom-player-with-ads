import EnumEvents from '../../enums/EnumEvents';
import './ButtonPlay';
import './ButtonPlayAd';
import './ButtonStop';
import './ButtonMute';
import './ButtonUnmute';
import html from '../../utils/html';

export default class ControlsPlayer extends HTMLElement {
    private rendered = false;

    private isPlaying = false;

    private muted = false;

    static get observedAttributes(): string[] {
        return ['muted', 'autoplay'];
    }

    constructor() {
        super();
        this.addEventListener('click', this.handleClick);
    }

    private render(): void {
        this.innerHTML = html`
            ${this.isPlaying
                ? '<button class="control-hoverable" is="button-stop"></button>'
                : '<button class="control-hoverable" is="button-play"></button>'}
            ${this.muted
                ? '<button class="control-hoverable" is="button-unmute"></button>'
                : '<button class="control-hoverable" is="button-mute"></button>'}
            <div class="spacer"></div>
            <button class="control-hoverable" is="button-play-ad"></button>
        `;
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
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

    private handleClick(event: Event): void {
        const target = event.target as HTMLElement;
        const is = target.closest('[is|="button"]')?.getAttribute('is');

        if (is === 'button-play') {
            this.dispatchEvent(
                new CustomEvent(EnumEvents.PlayPlayerOnboarding, {
                    bubbles: true,
                    composed: true
                })
            );
            this.isPlaying = true;
            this.render();

            return;
        }

        if (is === 'button-stop') {
            this.dispatchEvent(
                new CustomEvent(EnumEvents.StopPlayerOnboarding, {
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
                new CustomEvent(EnumEvents.MutePlayerOnboarding, {
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
                new CustomEvent(EnumEvents.UnmutePlayerOnboarding, {
                    bubbles: true,
                    composed: true
                })
            );
            this.muted = false;
            this.render();
        }

        if (is === 'button-play-ad') {
            this.dispatchEvent(
                new CustomEvent(EnumEvents.PlayAdPlayerOnboarding, {
                    bubbles: true,
                    composed: true
                })
            );
        }
    }
}

customElements.define('controls-player', ControlsPlayer);