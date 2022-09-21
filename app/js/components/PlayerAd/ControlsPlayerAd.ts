import EnumEventPlayerAd from '../../enums/EnumEventPlayerAd';
import html from '../../utils/html';
import './ButtonPlayAd';
import './ButtonPauseAd';
import './ButtonSkipAd';

export default class ControlsPlayerAd extends HTMLElement {
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
                ? '<button class="control-hoverable" is="button-pause-ad"></button>'
                : '<button class="control-hoverable" is="button-play-ad"></button>'}
            <div class="spacer"></div>
            <button is="button-skip-ad"></button>
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

        if (is === 'button-play-ad') {
            this.dispatchEvent(
                new CustomEvent(EnumEventPlayerAd.PlayPlayerAd, {
                    bubbles: true
                })
            );
            this.isPlaying = true;
            this.render();

            return;
        }

        if (is === 'button-pause-ad') {
            this.dispatchEvent(
                new CustomEvent(EnumEventPlayerAd.StopPlayerAd, {
                    bubbles: true
                })
            );
            this.isPlaying = false;
            this.render();
        }
    }
}

customElements.define('controls-player-ad', ControlsPlayerAd);
