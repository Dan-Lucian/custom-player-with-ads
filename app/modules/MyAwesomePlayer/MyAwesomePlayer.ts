import {
    addEventListenersUsingArray,
    html,
    isImaUrl,
    removeEventListenersUsingArray
} from 'utils/generalUtils';
import { ImaEventEnum } from 'modules/ImaLoader/enums/ImaEventEnum';
import { VideoQualityEnum } from 'modules/HlsWrapper/enums/VideoQualityEnum';
import { HlsWrapper } from 'modules/HlsWrapper/HlsWrapper';
import { styles } from 'modules/MyAwesomePlayer/MyAwesomePlayer.styles';
import { MyAwesomePlayerAttributeEnum } from 'modules/MyAwesomePlayer/enums/MyAwesomePlayerAttributeEnum';
import { MyAwesomePlayerConfig } from 'modules/MyAwesomePlayer/config/MyAwesomePlayerConfig';
import { PlayerEventEnum } from 'enums/PlayerEventEnum';
import { ComponentEnum } from 'enums/ComponentEnum';
import { TAttributeValue } from 'types/TAttributeValue';
import { isArrayDefined, isDefined, isNull, isString } from 'utils/typeUtils';
import { PlayerControlsAttributeEnum } from 'modules/PlayerControls/enums/PlayerControlsAttributeEnum';
import { adService, vastParser } from 'services/services';
import { AdPlayer } from 'modules/AdPlayer/AdPlayer';
import { AdPlayerAttributeEnum } from 'modules/AdPlayer/enums/AdPlayerAttributeEnum';
import { AdService } from 'modules/AdService/AdService';
import { IParsedVast } from 'interfaces/IParsedVast';
import { IPlayAdDetail } from 'interfaces/IPlayAdDetail';
import { IErrorDetail } from 'interfaces/IErrorDetail';
import { PlayerErrorEnum } from 'enums/PlayerErrorEnum';
import { IEventListener } from 'interfaces/IEventListener';
import { IVolumeChangeDetail } from 'interfaces/IVolumeChangeDetail';
import { IPlaylist } from 'interfaces/IPlaylist';

// TODO: "timeupdate" event + video.duration to obtain the video duration
// cause if it's fired it means the metadata has already been loaded
// TODO: "timeupdate" event + video.currentTime to update the progress bar
export class MyAwesomePlayer extends HTMLElement {
    private isAttached = false;
    private shouldAutoplay = false;
    private isPlaying = false;
    private isMuted = false;
    private isFloatingEnabled = false;
    private shouldUseIma = false;
    private isInView = true;
    private shadow: ShadowRoot;
    private playlist: IPlaylist[] = [];
    private currentVideo = 0;
    private width: string | null = MyAwesomePlayerConfig.DefaultWidth;
    private eventListeners: IEventListener[] = [];
    private observer?: IntersectionObserver;
    private hlsWrapper?: HlsWrapper;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    public static get observedAttributes(): string[] {
        return [
            MyAwesomePlayerAttributeEnum.Width,
            MyAwesomePlayerAttributeEnum.Muted,
            MyAwesomePlayerAttributeEnum.Autoplay,
            MyAwesomePlayerAttributeEnum.Playlist,
            MyAwesomePlayerAttributeEnum.UseIma,
            MyAwesomePlayerAttributeEnum.Float
        ];
    }

    public attributeChangedCallback(
        attribute: string,
        oldValue: TAttributeValue,
        newValue: TAttributeValue
    ): void {
        if (oldValue === newValue) {
            return;
        }

        switch (attribute) {
            case MyAwesomePlayerAttributeEnum.Width:
                this.width = newValue;
                break;

            case MyAwesomePlayerAttributeEnum.Autoplay:
                this.shouldAutoplay = isString(newValue);
                break;

            case MyAwesomePlayerAttributeEnum.Muted:
                this.isMuted = isString(newValue);
                break;

            case MyAwesomePlayerAttributeEnum.Playlist:
                if (isString(newValue)) {
                    this.playlist = JSON.parse(newValue);
                } else {
                    this.playlist = [];
                }
                break;

            case MyAwesomePlayerAttributeEnum.UseIma:
                this.shouldUseIma = isString(newValue);
                return;

            case MyAwesomePlayerAttributeEnum.Float:
                if (isString(newValue)) {
                    this.setupIntersectionObserver();
                    this.isFloatingEnabled = true;
                } else {
                    this.observer?.unobserve(this);
                    this.isFloatingEnabled = false;
                }
                return;

            default:
                break;
        }

        if (!this.isAttached) {
            return;
        }
        this.render();
    }

    public connectedCallback(): void {
        if (!this.isAttached) {
            this.render();
            this.isAttached = true;
            if (this.isFloatingEnabled) {
                this.setupIntersectionObserver();
            }
            this.addEventListeners();
        }
    }

    public disconnectedCallback(): void {
        this.observer?.unobserve(this);
        this.hlsWrapper?.destroy();
        this.isAttached = false;
        this.removeEventListeners();
    }

    public playAd(event: Event): void {
        this._playAd(event);
    }

    private getAdPlayer(): AdPlayer {
        return this.shadow.getElementById(ComponentEnum.AdPlayer) as AdPlayer;
    }

    private getVideoElement(): HTMLVideoElement {
        return this.shadow.getElementById(ComponentEnum.MyAwesomePlayer) as HTMLVideoElement;
    }

    private getPlayerContainer(): HTMLDivElement {
        return this.shadow.getElementById('player-container') as HTMLDivElement;
    }

    private getPlayerPlaceholder(): HTMLDivElement {
        return this.shadow.getElementById('player-placeholder') as HTMLDivElement;
    }

    private getPlayerControlsElement(): HTMLElement {
        return this.shadow.getElementById(ComponentEnum.PlayerControls) as HTMLElement;
    }

    private render(): void {
        console.log(`RENDER: <${ComponentEnum.MyAwesomePlayer}>`);
        const autoplayAttribute = this.shouldAutoplay ? MyAwesomePlayerAttributeEnum.Autoplay : '';
        const mutedAttribute = this.isMuted ? MyAwesomePlayerAttributeEnum.Muted : '';
        const useImaAttribute = this.shouldUseIma ? MyAwesomePlayerAttributeEnum.UseIma : '';
        const playerWidth = isNull(this.width) ? '' : this.width;

        this.shadow.innerHTML = html`
            <style>
                ${styles}
            </style>
            <div id="player-placeholder">
                <div id="player-container">
                    <video
                        ${autoplayAttribute}
                        ${mutedAttribute}
                        width=${playerWidth}
                        id=${ComponentEnum.MyAwesomePlayer}
                        preload="metadata"
                    >
                        Player not supported
                    </video>
                    <player-controls
                        ${autoplayAttribute}
                        ${mutedAttribute}
                        id=${ComponentEnum.PlayerControls}
                    ></player-controls>
                    <ad-player ${useImaAttribute} hidden id=${ComponentEnum.AdPlayer}> </ad-player>
                </div>
            </div>
        `;

        const videoElement = this.getVideoElement();
        videoElement.addEventListener('ended', this.playNext.bind(this));
        this.setupHls();
    }

    private setupHls(): void {
        if (!isArrayDefined(this.playlist)) {
            return;
        }

        const videoElement = this.getVideoElement();
        const src = this.playlist[this.currentVideo].streamingManifest;

        try {
            this.hlsWrapper = HlsWrapper.getInstance();
            this.hlsWrapper.initialize(videoElement, src, this.setQualityLevels.bind(this));
        } catch (error) {
            if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                console.log('MyAwesomePlayer_can_play_hls_natively_apple');
                videoElement.src = src;
            } else {
                console.log('MyAwesomePlayer_hls_is_not_supported ');
                videoElement.src = this.playlist[this.currentVideo].video;
            }
        }
    }

    private refreshWithoutRender(): void {
        const videoElement = this.getVideoElement();
        const playerControlsElement = this.getPlayerControlsElement();

        if (isDefined(this.hlsWrapper) && isArrayDefined(this.playlist)) {
            this.hlsWrapper.loadSource(this.playlist[this.currentVideo].streamingManifest);
        } else {
            videoElement.src = this.playlist[this.currentVideo].video;
        }

        const newPlayerControlsElement = document.createElement(ComponentEnum.PlayerControls);
        newPlayerControlsElement.id = ComponentEnum.PlayerControls;

        if (this.shouldAutoplay) {
            newPlayerControlsElement.setAttribute(MyAwesomePlayerAttributeEnum.Autoplay, '');
        }

        if (this.isMuted) {
            newPlayerControlsElement.setAttribute(MyAwesomePlayerAttributeEnum.Muted, '');
        }

        playerControlsElement.replaceWith(newPlayerControlsElement);
    }

    private setupIntersectionObserver(): void {
        if (!isDefined(this.observer)) {
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
        if (this.isInView === isIntersecting) {
            return;
        }

        this.isInView = isIntersecting;
        const playerPlaceholder = this.getPlayerPlaceholder();
        const playerContainer = this.getPlayerContainer();
        const { width, height } = playerContainer.getBoundingClientRect();

        // set placeholder dimensions to match player dimensions
        playerPlaceholder.style.height = height ? `${height}px` : 'auto';
        playerPlaceholder.style.width = width ? `${width}px` : 'auto';

        // set container position if player in/out of view
        playerContainer.style.position = isIntersecting ? 'static' : 'fixed';
    }

    private addEventListeners(): void {
        this.eventListeners.push(
            {
                element: this,
                event: PlayerEventEnum.Play,
                callback: this.play
            },
            {
                element: this,
                event: PlayerEventEnum.PlayAd,
                callback: this._playAd
            },
            {
                element: this,
                event: PlayerEventEnum.Pause,
                callback: this.pause
            },
            {
                element: this,
                event: PlayerEventEnum.Mute,
                callback: this.mute
            },
            {
                element: this,
                event: PlayerEventEnum.Unmute,
                callback: this.unmute
            },
            {
                element: this,
                event: PlayerEventEnum.VolumeChange,
                callback: this.changeVolume
            },
            {
                element: this,
                event: PlayerEventEnum.PlayNext,
                callback: this.playNext
            },
            {
                element: this,
                event: PlayerEventEnum.PlayPrevious,
                callback: this.playPrevious
            },
            {
                element: this,
                event: PlayerEventEnum.SkipAd,
                callback: this.hideAd
            },
            {
                element: this,
                event: PlayerEventEnum.ChangeStreamingQuality,
                callback: this.changeStreamingQuality
            },
            {
                element: this,
                event: PlayerEventEnum.EndAd,
                callback: this.hideAd
            },
            {
                element: this,
                event: ImaEventEnum.AdEnd,
                callback: this.hideAd
            },
            {
                element: this,
                event: ImaEventEnum.AdSkip,
                callback: this.hideAd
            },
            {
                element: this,
                event: ImaEventEnum.AdsManagerError,
                callback: this.hideAd
            }
        );
        addEventListenersUsingArray(this.eventListeners);
    }

    private removeEventListeners(): void {
        removeEventListenersUsingArray(this.eventListeners);
    }

    private hideAd(): void {
        const AdPlayer = this.getAdPlayer();
        AdPlayer.setAttribute(AdPlayerAttributeEnum.Hidden, '');
        this.play();
    }

    private mute(): void {
        const videoElement = this.getVideoElement();
        videoElement.muted = true;
        this.isMuted = true;
    }

    private unmute(): void {
        const videoElement = this.getVideoElement();
        videoElement.muted = false;
        this.isMuted = false;
    }

    private changeVolume(event: Event): void {
        const customEvent = event as CustomEvent<IVolumeChangeDetail>;
        const { volume } = customEvent.detail;
        const videoElement = this.getVideoElement();

        videoElement.volume = volume;
        console.log(volume);

        if (volume > 0) {
            this.isMuted = false;
        } else {
            this.isMuted = true;
        }
    }

    private pause(): void {
        const videoElement = this.getVideoElement();
        videoElement.pause();
        this.isPlaying = false;
    }

    private play(): void {
        const videoElement = this.getVideoElement();
        videoElement.play();
        this.isPlaying = true;
    }

    private playNext(): void {
        if (!isArrayDefined(this.playlist)) {
            return;
        }

        const max = this.playlist.length - 1;

        if (this.currentVideo === max) {
            this.currentVideo = 0;
        } else {
            this.currentVideo += 1;
        }

        this.refreshWithoutRender();
    }

    private playPrevious(): void {
        if (!isArrayDefined(this.playlist)) {
            return;
        }

        const max = this.playlist.length - 1;

        if (this.currentVideo === 0) {
            this.currentVideo = max;
        } else {
            this.currentVideo -= 1;
        }

        this.refreshWithoutRender();
    }

    private async _playAd(event: Event): Promise<void> {
        if (!this.isPlaying) {
            this.dispatchEvent(
                new CustomEvent<IErrorDetail>(PlayerEventEnum.Error, {
                    bubbles: true,
                    composed: true,
                    detail: { error: PlayerErrorEnum.AttemptAdPlayDuringPause }
                })
            );
            return;
        }

        const customEvent = event as CustomEvent<IPlayAdDetail>;
        const { shouldUseIma } = customEvent.detail;
        let { url } = customEvent.detail;

        let parsedVast: IParsedVast;
        url = isDefined(url) ? url : adService.getRandomAdUrl();

        if (shouldUseIma || isImaUrl(url)) {
            parsedVast = {
                isIMAUrl: true,
                isVPAID: false,
                mediaLink: url
            };
        } else {
            const vast = await AdService.requestAdByUrl(url);
            parsedVast = vastParser.parseString(vast);
        }

        this.pause();

        const adPlayer = this.getAdPlayer();
        adPlayer.removeAttribute(AdPlayerAttributeEnum.Hidden);
        adPlayer.parsedVast = parsedVast;
    }

    private setQualityLevels(levels: string[]): void {
        const playerControlsElement = this.getPlayerControlsElement();
        playerControlsElement.setAttribute(PlayerControlsAttributeEnum.Qualities, levels.join());
    }

    private changeStreamingQuality(event: Event): void {
        const customEvent = event as CustomEvent<{ quality: VideoQualityEnum }>;
        this.hlsWrapper?.setQualityTo(customEvent.detail.quality);
    }
}
