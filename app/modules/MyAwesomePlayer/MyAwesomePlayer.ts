import { html, isImaUrl } from 'utils/generalUtils';
import { ImaEventEnum } from 'enums/ImaEventEnum';
import { VideoQualityEnum } from 'enums/VideoQualityEnum';
import { HlsWrapper } from 'modules/MyAwesomePlayer/vendors/HlsWrapper';
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
import { AdService } from 'services/AdService';
import { IParsedVast } from 'interfaces/IParsedVast';

// TODO: "timeupdate" event + video.duration to obtain the video duration
// cause if it's fired it means the metadata has already been loaded
// TODO: "timeupdate" event + video.currentTime to update the progress bar
export class MyAwesomePlayer extends HTMLElement {
    private isAttached = false;
    private shouldAutoplay = false;
    private isPlaying = false;
    private isMuted = false;
    private shouldUseIma = false;
    private isInView = true;
    private shadow: ShadowRoot;
    private playlist: { video: string; streamingManifest: string }[] = [];
    private currentVideo = 0;
    private width: string | null = MyAwesomePlayerConfig.DefaultWidth;
    private observer?: IntersectionObserver;
    private hlsWrapper?: HlsWrapper;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        this.addEventListener(PlayerEventEnum.Play, this.play);
        this.addEventListener(PlayerEventEnum.PlayAd, this.renderAd.bind(this, false));
        this.addEventListener(PlayerEventEnum.PlayImaAd, this.renderAd.bind(this, true));
        this.addEventListener(PlayerEventEnum.Pause, this.pause);
        this.addEventListener(PlayerEventEnum.Mute, this.mute);
        this.addEventListener(PlayerEventEnum.Unmute, this.unmute);
        this.addEventListener(PlayerEventEnum.PlayNext, this.playNext);
        this.addEventListener(PlayerEventEnum.PlayPrevious, this.playPrevious);
        this.addEventListener(PlayerEventEnum.SkipAd, this.hideAd);
        this.addEventListener(PlayerEventEnum.ChangeStreamingQuality, this.changeStreamingQuality);
        this.addEventListener(PlayerEventEnum.EndAd, this.hideAd);
        this.addEventListener(ImaEventEnum.AdEnd, this.hideAd);
        this.addEventListener(ImaEventEnum.AdSkip, this.hideAd);
        this.addEventListener(ImaEventEnum.AdsManagerError, this.hideAd);
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
            this.setupIntersectionObserver();
            this.isAttached = true;
        }
    }

    public disconnectedCallback(): void {
        this.observer?.unobserve(this);
        this.hlsWrapper?.destroy();
        this.isAttached = false;
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
        playerPlaceholder.style.height = height ? `${height}` : 'auto';
        playerPlaceholder.style.width = width ? `${width}` : 'auto';

        // set container position if player in/out of view
        playerContainer.style.position = isIntersecting ? 'static' : 'fixed';
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

    private async renderAd(shouldUseIma: boolean): Promise<void> {
        let parsedVast: IParsedVast;
        const url = adService.getRandomAdUrl();
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

    private unmute(): void {
        const videoElement = this.getVideoElement();
        videoElement.muted = false;
        this.isMuted = false;
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
