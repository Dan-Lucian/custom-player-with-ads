import { EnumEventPlayerAd } from 'enums/AdPlayerEventEnum';
import { PlayerEventEnum } from 'enums/PlayerEventEnum';
import styles from './PlayerAdVideo.styles';
import '../ControlsPlayerAd';

export default class PlayerAdVideo extends HTMLElement {
    private dataSrc = '';
    private rendered = false;
    private autoplay = false;
    private muted = false;

    constructor() {
        super();

        this.addEventListener(EnumEventPlayerAd.Play, this.play);
        this.addEventListener(EnumEventPlayerAd.Pause, this.pause);
        this.addEventListener(EnumEventPlayerAd.Mute, this.mute);
        this.addEventListener(EnumEventPlayerAd.Unmute, this.unmute);
        this.addEventListener(EnumEventPlayerAd.SkipAd, this.skipAd);
    }

    private get videoElement(): HTMLVideoElement | null {
        return this.querySelector('#player-ad') || null;
    }

    public static get observedAttributes(): string[] {
        return ['data-src'];
    }

    public async attributeChangedCallback(
        property: string,
        oldValue: unknown,
        newValue: unknown
    ): Promise<void> {
        if (oldValue === newValue) {
            return;
        }

        switch (property) {
            case 'data-src':
                this.dataSrc = String(newValue);
                break;

            default:
                break;
        }

        if (!this.rendered) {
            return;
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
        console.log('RENDER: <player-ad-video>');
        const styleElement = document.createElement('style');
        styleElement.innerHTML = styles;

        const controlsPlayerAd = document.createElement('controls-player-ad');
        controlsPlayerAd.setAttribute('autoplay', '');
        controlsPlayerAd.setAttribute('hidden', '');

        const video = document.createElement('video');
        const source = document.createElement('source');
        source.src = this.dataSrc;
        video.appendChild(source);
        video.autoplay = this.autoplay;
        video.muted = this.muted;
        video.id = 'player-ad';
        video.preload = 'metadata';
        video.oncanplay = (): void => this.handleVideoLoad(controlsPlayerAd);

        this.replaceChildren(styleElement, video, controlsPlayerAd);
    }

    private handleVideoLoad(controlsPlayerAd: HTMLElement): void {
        console.log('EVENT HEARD: canplay');
        controlsPlayerAd.removeAttribute('hidden');
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

    private unmute(): void {
        if (this.videoElement) {
            this.videoElement.muted = false;
        }
    }

    private skipAd(): void {
        console.log('EVENT DISPATCHED: ', PlayerEventEnum.SkipAd);
        this.dataSrc = '';
        this.render();
        this.dispatchEvent(
            new CustomEvent(PlayerEventEnum.SkipAd, {
                bubbles: true,
                composed: true
            })
        );
    }
}

customElements.define('player-ad-video', PlayerAdVideo);
