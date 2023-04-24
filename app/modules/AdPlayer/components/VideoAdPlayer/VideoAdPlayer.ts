import { AdPlayerEventEnum } from 'modules/AdPlayer/enums/AdPlayerEventEnum';
import { PlayerEventEnum } from 'enums/PlayerEventEnum';
import { styles } from 'modules/AdPlayer/components/VideoAdPlayer/VideoAdPlayer.styles';
import { VideoAdPlayerAttributeEnum } from 'modules/AdPlayer/components/VideoAdPlayer/enums/VideoAdPlayerAttributeEnum';
import { TAttributeValue } from 'types/TAttributeValue';
import { ComponentEnum } from 'enums/ComponentEnum';
import { isNull } from 'utils/typeUtils';
// eslint-disable-next-line max-len
import { AdPlayerControlsAttributeEnum } from 'modules/AdPlayer/components/AdPlayerControls/enums/AdPlayerControlsAttributeEnum';

export class VideoAdPlayer extends HTMLElement {
    private src: string | null = null;
    private isAttached = false;
    private shouldAutoplay = false;
    private isMuted = false;

    constructor() {
        super();

        this.addEventListener(AdPlayerEventEnum.Play, this.play);
        this.addEventListener(AdPlayerEventEnum.Pause, this.pause);
        this.addEventListener(AdPlayerEventEnum.Mute, this.mute);
        this.addEventListener(AdPlayerEventEnum.Unmute, this.unmute);
        this.addEventListener(AdPlayerEventEnum.SkipAd, this.skipAd);
    }

    public static get observedAttributes(): string[] {
        return [VideoAdPlayerAttributeEnum.Src];
    }

    private get videoElement(): HTMLVideoElement {
        return this.querySelector(`#${ComponentEnum.VideoAdPlayer}__video`) as HTMLVideoElement;
    }

    public async attributeChangedCallback(
        attribute: string,
        oldValue: TAttributeValue,
        newValue: TAttributeValue
    ): Promise<void> {
        if (oldValue === newValue) {
            return;
        }

        switch (attribute) {
            case VideoAdPlayerAttributeEnum.Src:
                this.src = newValue;
                break;

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
        }
    }

    private render(): void {
        console.log(`RENDER: ${ComponentEnum.VideoAdPlayer}`);
        const styleElement = document.createElement('style');
        styleElement.innerHTML = styles;

        const adPlayerControls = document.createElement(ComponentEnum.AdPlayerControls);
        adPlayerControls.setAttribute(AdPlayerControlsAttributeEnum.Autoplay, '');
        adPlayerControls.setAttribute(AdPlayerControlsAttributeEnum.Hidden, '');

        const source = document.createElement('source');
        source.src = isNull(this.src) ? '' : this.src;

        const video = document.createElement('video');
        video.appendChild(source);
        video.autoplay = this.shouldAutoplay;
        video.muted = this.isMuted;
        video.id = `${ComponentEnum.VideoAdPlayer}__video`;
        video.preload = 'metadata';
        video.oncanplay = (): void => this.handleVideoLoad(adPlayerControls);

        this.replaceChildren(styleElement, video, adPlayerControls);
    }

    // TODO: change type to AdPlayerControls
    private handleVideoLoad(adPlayerControls: HTMLElement): void {
        console.log('EVENT HEARD: canplay');
        adPlayerControls.removeAttribute(AdPlayerControlsAttributeEnum.Hidden);
        this.play();
    }

    private mute(): void {
        this.videoElement.muted = true;
    }

    private pause(): void {
        this.videoElement.pause();
    }

    private play(): void {
        this.videoElement.play();
    }

    private unmute(): void {
        this.videoElement.muted = false;
    }

    private skipAd(): void {
        console.log('EVENT DISPATCHED: ', PlayerEventEnum.SkipAd);
        this.src = null;
        this.render();
        this.dispatchEvent(
            new CustomEvent(PlayerEventEnum.SkipAd, {
                bubbles: true,
                composed: true
            })
        );
    }
}
