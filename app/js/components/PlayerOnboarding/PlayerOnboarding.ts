import html from '../../utils/html';
import EnumEvents from '../../enums/EnumEvents';
import './ControlsPlayer';
import styles from './PlayerOnboarding.styles';

export default class PlayerOnboarding extends HTMLElement {
    public src = '';

    public muted = false;

    public autoplay = false;

    public width = '500';

    private shadow: ShadowRoot;

    private rendered = false;

    get videoElement(): HTMLMediaElement | null {
        if (this.shadow) {
            return this.shadow.getElementById('player-onboarding') as HTMLMediaElement;
        }

        return null;
    }

    static get observedAttributes(): string[] {
        return ['src', 'width', 'muted', 'autoplay'];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        this.addEventListener(EnumEvents.PlayPlayerOnboarding, this.play);
        this.addEventListener(EnumEvents.StopPlayerOnboarding, this.stop);
        this.addEventListener(EnumEvents.MutePlayerOnboarding, this.mute);
        this.addEventListener(EnumEvents.UnmutePlayerOnboarding, this.unmute);
    }

    private render(): void {
        const autoplay = this.autoplay ? 'autoplay' : '';
        const muted = this.muted ? 'muted' : '';

        if (this.shadow) {
            this.shadow.innerHTML = html`
                <style>
                    ${styles}
                </style>

                <video
                    ${autoplay}
                    ${muted}
                    src=${this.src}
                    width=${this.width}
                    id="player-onboarding"
                >
                    Player not supported
                </video>
                <controls-player ${autoplay} ${muted}></controls-player>
            `;
        }
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    public attributeChangedCallback(property: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) return;

        if (property === 'src') {
            this.src = newValue;
            this.render();
        }

        if (property === 'width') {
            this.width = newValue;
            this.render();
        }

        if (property === 'autoplay') {
            this.autoplay = !this.autoplay;
            this.render();
        }

        if (property === 'muted') {
            this.muted = !this.muted;
            this.render();
        }
    }

    private play(): void {
        this.videoElement?.play();
    }

    private stop(): void {
        this.videoElement?.pause();
    }

    private mute(): void {
        if (this.videoElement) {
            this.videoElement.muted = true;
        }
    }

    private unmute(): void {
        if (this.videoElement) {
            this.videoElement.muted = false;
        }
    }
}

customElements.define('player-onboarding', PlayerOnboarding);
