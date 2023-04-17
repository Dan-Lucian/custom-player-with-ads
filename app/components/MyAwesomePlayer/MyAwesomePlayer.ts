import 'components/MyAwesomePlayer/components/ControlsPlayer';
import 'components/PlayerAd';
import html from 'utils/html';
import { EnumEventIma } from 'enums/ImaEventEnum';
import { VideoQualityEnum } from 'enums/VideoQualityEnum';
import { HlsWrapper } from 'components/MyAwesomePlayer/vendors/HlsWrapper';
import { styles } from 'components/MyAwesomePlayer/MyAwesomePlayer.styles';
import { MyAwesomePlayerAttributeEnum } from 'components/MyAwesomePlayer/enums/MyAwesomePlayerAttributeEnum';
import { MyAwesomePlayerConfig } from 'components/MyAwesomePlayer/config/MyAwesomePlayerConfig';
import { PlayerEventEnum } from '../../enums/PlayerEventEnum';

// TODO: "timeupdate" event + video.duration to obtain the video duration
// cause if it's fired it means the metadata has already been loaded
// TODO: "timeupdate" event + video.currentTime to update the progress bar
export class MyAwesomePlayer extends HTMLElement {
    private hasRendered = false;
    private shouldAutoplay = false;
    private isPlaying = false;
    private isMuted = false;
    private shouldUseIma = false;
    private isInView = true;
    private shadow!: ShadowRoot;
    private playlist: { video: string; streamingManifest: string }[] = [];
    private currentVideo = 0;
    private width = MyAwesomePlayerConfig.DefaultWidth;
    private observer: IntersectionObserver | null = null;
    private hlsWrapper?: HlsWrapper;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        this.addEventListener(PlayerEventEnum.Play, this.play);
        this.addEventListener(PlayerEventEnum.PlayAd, this.renderAd);
        this.addEventListener(PlayerEventEnum.PlayImaAd, this.renderAdThroughIma);
        this.addEventListener(PlayerEventEnum.Pause, this.pause);
        this.addEventListener(PlayerEventEnum.Mute, this.mute);
        this.addEventListener(PlayerEventEnum.Unmute, this.unmute);
        this.addEventListener(PlayerEventEnum.PlayNext, this.playNext);
        this.addEventListener(PlayerEventEnum.PlayPrevious, this.playPrevious);
        this.addEventListener(PlayerEventEnum.SkipAd, this.hideAd);
        this.addEventListener(PlayerEventEnum.ChangeQuality, this.changeQuality);
        this.addEventListener(PlayerEventEnum.EndAd, this.hideAd);
        this.addEventListener(EnumEventIma.AdEnd, this.hideAd);
        this.addEventListener(EnumEventIma.AdSkip, this.hideAd);
        this.addEventListener(EnumEventIma.AdsManagerError, this.hideAd);
    }

    public static get observedAttributes(): string[] {
        return [
            MyAwesomePlayerAttributeEnum.Width,
            MyAwesomePlayerAttributeEnum.Muted,
            MyAwesomePlayerAttributeEnum.Autoplay,
            MyAwesomePlayerAttributeEnum.Playlist,
            MyAwesomePlayerAttributeEnum.UseIma
        ];
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

    private attributeChangedCallback(
        attribute: string,
        oldValue: unknown,
        newValue: unknown
    ): void {
        if (oldValue === newValue) return;

        switch (attribute) {
            case MyAwesomePlayerAttributeEnum.Width:
                this.width = String(newValue);
                break;

            case MyAwesomePlayerAttributeEnum.Autoplay:
                this.shouldAutoplay = !this.shouldAutoplay;
                break;

            case MyAwesomePlayerAttributeEnum.Muted:
                this.isMuted = !this.isMuted;
                break;

            case MyAwesomePlayerAttributeEnum.Playlist:
                this.playlist = JSON.parse(newValue as string);
                break;

            case MyAwesomePlayerAttributeEnum.UseIma:
                if (newValue === null) {
                    this.shouldUseIma = false;
                } else {
                    this.shouldUseIma = true;
                }
                return;

            default:
                break;
        }

        if (!this.hasRendered) return;
        this.render();
    }

    public connectedCallback(): void {
        if (!this.hasRendered) {
            this.render();
            this.setupIntersectionObserver();
            this.hasRendered = true;
        }
    }

    public disconnectedCallback(): void {
        this.observer?.unobserve(this);
        this.hlsWrapper?.destroy();
    }

    private render(): void {
        console.log('RENDER: <player-onboarding>');
        const autoplay = this.shouldAutoplay ? MyAwesomePlayerAttributeEnum.Autoplay : '';
        const muted = this.isMuted ? MyAwesomePlayerAttributeEnum.Muted : '';
        const dataUseIma = this.shouldUseIma ? MyAwesomePlayerAttributeEnum.UseIma : '';

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
        this.hlsWrapper = HlsWrapper.getInstance();
        this.hlsWrapper.setConfig(this.videoElement, src, this.setInitialQualityLevels.bind(this));

        try {
            this.hlsWrapper.initialize();
        } catch (error) {
            if (this.videoElement) {
                if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                    console.log('HLS: can play hls natively (apple)');
                    this.videoElement.src = src;
                } else {
                    console.log('HLS: hls is not supported ');
                    this.videoElement.src = this.playlist[this.currentVideo].video;
                }
            }
        }
    }

    private refreshWithoutRender(): void {
        if (this.videoElement) {
            if (this.hlsWrapper) {
                this.hlsWrapper.loadSource(this.playlist[this.currentVideo].streamingManifest);
            } else {
                this.videoElement.src = this.playlist[this.currentVideo].video;
            }
        }

        if (this.controlsElement) {
            const newControlsElement = document.createElement('controls-player');
            newControlsElement.id = 'controls-player';

            if (this.shouldAutoplay) {
                newControlsElement.setAttribute(MyAwesomePlayerAttributeEnum.Autoplay, '');
            }

            if (this.isMuted) {
                newControlsElement.setAttribute(MyAwesomePlayerAttributeEnum.Muted, '');
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
            this.isMuted = true;
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
        this.playerAd?.setAttribute(MyAwesomePlayerAttributeEnum.UseIma, '');
        this.playerAd?.removeAttribute('hidden');
    }

    private unmute(): void {
        if (this.videoElement) {
            this.videoElement.muted = false;
            this.isMuted = false;
        }
    }

    private setInitialQualityLevels(levels: string[]): void {
        this.controlsElement?.setAttribute('data-qualities', levels.join());
    }

    private changeQuality(event: Event): void {
        const customEvent = event as CustomEvent<{ quality: VideoQualityEnum }>;
        this.hlsWrapper?.setQualityTo(customEvent.detail.quality);
    }
}
