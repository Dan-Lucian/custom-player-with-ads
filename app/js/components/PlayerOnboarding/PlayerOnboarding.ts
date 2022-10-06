import Hls from 'hls.js';
import html from '../../utils/html';
import EnumEventPlayer from '../../enums/EnumEventPlayer';
import './components/ControlsPlayer';
import '../PlayerAd';
import styles from './PlayerOnboarding.styles';
import EnumEventIma from '../../enums/EnumEventIma';

// TODO: "timeupdate" event + video.duration to obtain the video duration
// cause if it's fired it means the metadata has already been loaded
// TODO: "timeupdate" event + video.currentTime to update the progress bar
export default class PlayerOnboarding extends HTMLElement {
    private rendered = false;
    private shadow!: ShadowRoot;
    private playlist: { video: string; streamingManifest: string }[] = [];
    private currentVideo = 0;
    private autoplay = false;
    private isPlaying = false;
    private hls?: Hls;
    private muted = false;
    private dataUseIma = false;
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
        this.addEventListener(EnumEventIma.SkippedAdIma, this.hideAd);
        this.addEventListener(EnumEventIma.ErrorAdsManager, this.hideAd);
    }

    public static get observedAttributes(): string[] {
        return ['width', 'muted', 'autoplay', 'playlist', 'data-use-ima'];
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
                this.playlist = JSON.parse(newValue as string);
                break;

            case 'data-use-ima':
                if (newValue === null) {
                    this.dataUseIma = false;
                } else {
                    this.dataUseIma = true;
                }
                return;

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
        const dataUseIma = this.dataUseIma ? 'data-use-ima' : '';

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
                        <player-ad ${dataUseIma} hidden id="player-ad"></player-ad>
                    </div>
                </div>
            `;
        }

        this.videoElement?.addEventListener('ended', this.playNext.bind(this));
        this.setupHls();
    }

    private setupHls(): void {
        const src = this.playlist[this.currentVideo].streamingManifest;
        if (this.videoElement) {
            if (Hls.isSupported()) {
                console.log('HLS: hls is supported ');
                this.hls = new Hls();
                this.hls.loadSource(src);
                this.hls.attachMedia(this.videoElement);
            } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                console.log('HLS: can play hls natively (apple)');
                this.videoElement.src = src;
            } else {
                console.log('HLS: hls is not supported ');
                this.videoElement.src = this.playlist[this.currentVideo].video;
            }
        }
    }

    private refreshWithoutRender(): void {
        if (this.videoElement) {
            if (this.hls) {
                this.hls.loadSource(this.playlist[this.currentVideo].streamingManifest);
            } else {
                this.videoElement.src = this.playlist[this.currentVideo].video;
            }
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
        this.playerAd?.setAttribute('data-use-ima', '');
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
