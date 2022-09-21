import html from '../../utils/html';
import EnumEvents from '../../enums/EnumEvents';
import './ControlsPlayer';
import '../PlayerAd';
import styles from './PlayerOnboarding.styles';
import poster from '../../../assets/poster.bmp';

// TODO: "timeupdate" event + video.duration to obtain the video duration
// cause if it's fired it means the metadata has already been loaded
// TODO: "timeupdate" event + video.currentTime to update the progress bar
export default class PlayerOnboarding extends HTMLElement {
    public src = '';

    public muted = false;

    public autoplay = false;

    public width = '500';

    private shadow: ShadowRoot;

    private rendered = false;

    get videoElement(): HTMLVideoElement | null {
        if (this.shadow) {
            return this.shadow.getElementById('player-onboarding') as HTMLVideoElement;
        }

        return null;
    }

    get playerAd(): HTMLElement | null {
        if (this.shadow) {
            return this.shadow.getElementById('player-ad');
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
        this.addEventListener(EnumEvents.PlayAdPlayerOnboarding, this.renderAd);
        this.addEventListener(EnumEvents.StopPlayerOnboarding, this.stop);
        this.addEventListener(EnumEvents.MutePlayerOnboarding, this.mute);
        this.addEventListener(EnumEvents.UnmutePlayerOnboarding, this.unmute);
        this.addEventListener(EnumEvents.SkipAd, this.hideAd);
        this.addEventListener(EnumEvents.EndAd, this.hideAd);
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
                    poster=${poster}
                    preload="metadata"
                >
                    Player not supported
                </video>
                <controls-player ${autoplay} ${muted}></controls-player>
                <player-ad hidden id="player-ad"></player-ad>
            `;
        }
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    public attributeChangedCallback(property: string, oldValue: unknown, newValue: unknown): void {
        if (oldValue === newValue) return;

        switch (property) {
            case 'src':
                this.src = String(newValue);
                break;

            case 'width':
                this.width = String(newValue);
                break;

            case 'autoplay':
                this.autoplay = !this.autoplay;
                break;

            case 'muted':
                this.muted = !this.muted;
                break;

            default:
                break;
        }

        this.render();
    }

    private async play(): Promise<void> {
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

    private renderAd(): void {
        this.stop();
        this.playerAd?.removeAttribute('hidden');
    }

    private hideAd(): void {
        this.playerAd?.setAttribute('hidden', '');
        this.play();
    }
}

customElements.define('player-onboarding', PlayerOnboarding);
