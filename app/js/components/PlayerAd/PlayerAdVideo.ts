import styles from './PlayerAdVideo.styles';
import './ControlsPlayerAd';
import EnumEventPlayerAd from '../../enums/EnumEventPlayerAd';
import EnumEventPlayer from '../../enums/EnumEventPlayer';

export default class PlayerAdVideo extends HTMLElement {
    private dataSrc = '';
    private rendered = false;
    private autoplay = false;
    private muted = false;
    private whenLoaded = Promise.all([customElements.whenDefined('controls-player-ad')]);

    constructor() {
        super();

        this.addEventListener(EnumEventPlayerAd.PlayPlayerAd, this.play);
        this.addEventListener(EnumEventPlayerAd.PausePlayerAd, this.pause);
        this.addEventListener(EnumEventPlayerAd.MutePlayerAd, this.mute);
        this.addEventListener(EnumEventPlayerAd.UnmutePlayerAd, this.unmute);
        this.addEventListener(EnumEventPlayerAd.SkipAdPlayerAd, this.skipAd);
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
        if (oldValue === newValue) return;

        switch (property) {
            case 'data-src':
                this.dataSrc = String(newValue);
                break;

            default:
                break;
        }

        if (!this.rendered) return;
        this.render();
    }

    public connectedCallback(): void {
        this.whenLoaded.then(() => {
            if (!this.rendered) {
                this.render();
                this.rendered = true;
            }
        });
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
        console.log('EVENT DISPATCHED: ', EnumEventPlayer.SkipAdPlayerOnboarding);
        this.dataSrc = '';
        this.render();
        this.dispatchEvent(
            new CustomEvent(EnumEventPlayer.SkipAdPlayerOnboarding, {
                bubbles: true,
                composed: true
            })
        );
    }
}

customElements.define('player-ad-video', PlayerAdVideo);
