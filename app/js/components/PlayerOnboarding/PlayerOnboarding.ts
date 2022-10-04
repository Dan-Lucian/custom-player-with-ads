import html from '../../utils/html';
import EnumEventPlayer from '../../enums/EnumEventPlayer';
import './ControlsPlayer';
import '../PlayerAd';
import styles from './PlayerOnboarding.styles';
import EnumEventIma from '../../enums/EnumEventIma';

console.log('FILE: PlayerOnboarding.ts');

// TODO: "timeupdate" event + video.duration to obtain the video duration
// cause if it's fired it means the metadata has already been loaded
// TODO: "timeupdate" event + video.currentTime to update the progress bar
export default class PlayerOnboarding extends HTMLElement {
    private rendered = false;
    private shadow!: ShadowRoot;
    private playlist: string[] = [''];
    private currentVideo = 0;
    private autoplay = false;
    private isPlaying = false;
    private muted = false;
    private width = '500';
    private isInView = true;
    private observer: IntersectionObserver | null = null;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        this.addEventListener(EnumEventPlayer.PlayPlayerOnboarding, this.play);
        this.addEventListener(EnumEventPlayer.PlayAdPlayerOnboarding, this.renderAd);
        this.addEventListener(EnumEventPlayer.PlayAdImaPlayerOnboarding, this.renderAdThroughIma);
        this.addEventListener(EnumEventPlayer.PausePlayerOnboarding, this.pause);
        this.addEventListener(EnumEventPlayer.MutePlayerOnboarding, this.mute);
        this.addEventListener(EnumEventPlayer.UnmutePlayerOnboarding, this.unmute);
        this.addEventListener(EnumEventPlayer.PlayNextPlayerOnboarding, this.playNext);
        this.addEventListener(EnumEventPlayer.PlayPreviousPlayerOnboarding, this.playPrevious);
        this.addEventListener(EnumEventPlayer.SkipAdPlayerOnboarding, this.hideAd);
        this.addEventListener(EnumEventPlayer.EndAd, this.hideAd);
        this.addEventListener(EnumEventIma.EndAdIma, this.hideAd);
    }

    public static get observedAttributes(): string[] {
        return ['width', 'muted', 'autoplay', 'playlist'];
    }

    private get playerAd(): HTMLElement | null {
        return this.shadow.getElementById('player-ad');
    }

    private get videoElement(): HTMLVideoElement | null {
        return this.shadow.getElementById('player-onboarding') as HTMLVideoElement | null;
    }

    private get playerContainer(): HTMLDivElement | null {
        return this.shadow.getElementById('player-container') as HTMLDivElement | null;
    }

    private get playerPlaceholder(): HTMLDivElement | null {
        return this.shadow.getElementById('player-placeholder') as HTMLDivElement | null;
    }

    private get controlsElement(): HTMLElement | null {
        return this.shadow.getElementById('controls-player') as HTMLElement | null;
    }

    private attributeChangedCallback(property: string, oldValue: unknown, newValue: unknown): void {
        if (oldValue === newValue) return;

        switch (property) {
            case 'width':
                this.width = String(newValue);
                break;

            case 'autoplay':
                this.autoplay = !this.autoplay;
                break;

            case 'muted':
                this.muted = !this.muted;
                break;

            case 'playlist':
                this.playlist = (newValue as string).split(',');
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
            this.setupIntersectionObserver();
            this.rendered = true;
        }
    }

    public disconnectedCallback(): void {
        this.observer?.unobserve(this);
    }

    private render(): void {
        console.log('RENDER: <player-onboarding>');
        const autoplay = this.autoplay ? 'autoplay' : '';
        const muted = this.muted ? 'muted' : '';

        if (this.shadow) {
            this.shadow.innerHTML = html`
                <style>
                    ${styles}
                </style>
                <div id="player-placeholder">
                    <div id="player-container">
                        <video
                            ${autoplay}
                            ${muted}
                            src=${this.playlist[this.currentVideo]}
                            width=${this.width}
                            id="player-onboarding"
                            preload="metadata"
                        >
                            Player not supported
                        </video>
                        <controls-player
                            ${autoplay}
                            ${muted}
                            id="controls-player"
                        ></controls-player>
                        <player-ad hidden id="player-ad"></player-ad>
                    </div>
                </div>
            `;
        }

        this.videoElement?.addEventListener('ended', this.playNext.bind(this));
    }

    private refreshWithoutRender(): void {
        if (this.videoElement) {
            this.videoElement.src = this.playlist[this.currentVideo];
        }

        if (this.controlsElement) {
            const newControlsElement = document.createElement('controls-player');
            newControlsElement.id = 'controls-player';

            if (this.autoplay) {
                newControlsElement.setAttribute('autoplay', '');
            }

            if (this.muted) {
                newControlsElement.setAttribute('muted', '');
            }

            this.controlsElement.replaceWith(newControlsElement);
        }
    }

    private setupIntersectionObserver(): void {
        if (!this.observer) {
            this.observer = new IntersectionObserver(
                ([entry]) => {
                    this.handlePlayerVisibilityChange(entry.isIntersecting);
                },
                { threshold: 0.5 }
            );
        }

        this.observer.observe(this);
    }

    private handlePlayerVisibilityChange(isIntersecting: boolean): void {
        if (this.isInView === isIntersecting) return;

        this.isInView = isIntersecting;
        if (this.playerPlaceholder && this.playerContainer) {
            const { width, height } = this.playerContainer.getBoundingClientRect();

            // set placeholder dimensions
            this.playerPlaceholder.style.height = height ? `${height}` : 'auto';
            this.playerPlaceholder.style.width = width ? `${width}` : 'auto';

            // set container position
            this.playerContainer.style.position = isIntersecting ? 'static' : 'fixed';
        }
    }

    private hideAd(): void {
        this.playerAd?.setAttribute('hidden', '');
        this.play();
    }

    private mute(): void {
        if (this.videoElement) {
            this.videoElement.muted = true;
            this.muted = true;
        }
    }

    private pause(): void {
        this.videoElement?.pause();
        this.isPlaying = false;
    }

    private play(): void {
        this.videoElement?.play();
        this.isPlaying = true;
    }

    private playNext(): void {
        const max = this.playlist.length - 1;

        if (this.currentVideo === max) {
            this.currentVideo = 0;
        } else {
            this.currentVideo += 1;
        }

        this.refreshWithoutRender();
    }

    private playPrevious(): void {
        const max = this.playlist.length - 1;

        if (this.currentVideo === 0) {
            this.currentVideo = max;
        } else {
            this.currentVideo -= 1;
        }

        this.refreshWithoutRender();
    }

    private renderAd(): void {
        this.pause();
        this.playerAd?.removeAttribute('hidden');
    }

    private renderAdThroughIma(): void {
        this.pause();
        this.playerAd?.setAttribute('data-ima', '');
        this.playerAd?.removeAttribute('hidden');
    }

    private unmute(): void {
        if (this.videoElement) {
            this.videoElement.muted = false;
            this.muted = false;
        }
    }
}

customElements.define('player-onboarding', PlayerOnboarding);
