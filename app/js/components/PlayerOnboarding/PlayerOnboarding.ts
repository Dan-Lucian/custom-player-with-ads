import html from '../../utils/html';
import EnumEventPlayer from '../../enums/EnumEventPlayer';
import './ControlsPlayer';
import '../PlayerAd';
import styles from './PlayerOnboarding.styles';
import poster from '../../../assets/poster.bmp';

// TODO: "timeupdate" event + video.duration to obtain the video duration
// cause if it's fired it means the metadata has already been loaded
// TODO: "timeupdate" event + video.currentTime to update the progress bar
export default class PlayerOnboarding extends HTMLElement {
    private rendered = false;
    private shadow: ShadowRoot;

    public autoplay = false;
    public muted = false;
    public src = '';
    public width = '500';

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        this.addEventListener(EnumEventPlayer.PlayPlayerOnboarding, this.play);
        this.addEventListener(EnumEventPlayer.PlayAdPlayerOnboarding, this.renderAd);
        this.addEventListener(EnumEventPlayer.PausePlayerOnboarding, this.pause);
        this.addEventListener(EnumEventPlayer.MutePlayerOnboarding, this.mute);
        this.addEventListener(EnumEventPlayer.UnmutePlayerOnboarding, this.unmute);
        this.addEventListener(EnumEventPlayer.SkipAdPlayerOnboarding, this.hideAd);
        this.addEventListener(EnumEventPlayer.EndAd, this.hideAd);
    }

    public static get observedAttributes(): string[] {
        return ['src', 'width', 'muted', 'autoplay'];
    }

    public get playerAd(): HTMLElement | null {
        if (this.shadow) {
            return this.shadow.getElementById('player-ad');
        }

        return null;
    }

    public get videoElement(): HTMLVideoElement | null {
        if (this.shadow) {
            return this.shadow.getElementById('player-onboarding') as HTMLVideoElement;
        }

        return null;
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

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
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

    private hideAd(): void {
        this.playerAd?.setAttribute('hidden', '');
        this.play();
    }

    private mute(): void {
        if (this.videoElement) {
            this.videoElement.muted = true;
        }
    }

    private pause(): void {
        this.videoElement?.pause();
    }

    private play(): void {
        this.videoElement?.play();
    }

    private renderAd(): void {
        this.pause();
        this.playerAd?.removeAttribute('hidden');
    }

    private unmute(): void {
        if (this.videoElement) {
            this.videoElement.muted = false;
        }
    }
}

customElements.define('player-onboarding', PlayerOnboarding);
