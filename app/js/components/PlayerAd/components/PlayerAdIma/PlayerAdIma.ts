import html from '../../../../utils/html';
import IMA from './IMA';
import styles from './PlayerAdIma.styles';
import EnumEventPlayerAd from '../../../../enums/EnumEventPlayerAd';

export default class PlayerAdIma extends HTMLElement {
    private src = '';
    private rendered = false;
    private ima: IMA | null = null;

    private get imaAdContainer(): HTMLDivElement | null {
        return this.querySelector('#ima-ad-container') as HTMLDivElement | null;
    }

    private get videoElement(): HTMLVideoElement | null {
        return this.closest('#player-container')?.querySelector(
            '#player-onboarding'
        ) as HTMLVideoElement | null;
    }

    public static get observedAttributes(): string[] {
        return ['src'];
    }

    public async attributeChangedCallback(
        property: string,
        oldValue: unknown,
        newValue: unknown
    ): Promise<void> {
        if (oldValue === newValue) return;

        switch (property) {
            case 'src':
                this.src = String(newValue);
                break;

            default:
                break;
        }

        if (!this.rendered) return;
        this.render();
    }

    constructor() {
        super();

        this.addEventListener(EnumEventPlayerAd.PlayPlayerAd, this.resume);
        this.addEventListener(EnumEventPlayerAd.PausePlayerAd, this.pause);
        this.addEventListener(EnumEventPlayerAd.MutePlayerAd, this.mute);
        this.addEventListener(EnumEventPlayerAd.UnmutePlayerAd, this.unmute);
        this.addEventListener(EnumEventPlayerAd.SkipAdPlayerAd, this.skipAd);
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.setupIMA();
            this.rendered = true;
        }
    }

    private render(): void {
        console.log('RENDER: <player-ad-ima>');
        this.innerHTML = html`
            <style>
                ${styles}
            </style>

            <div id="ima-ad-container"></div>
            <controls-player-ad autoplay></controls-player-ad>
        `;
    }

    private setupIMA(): void {
        this.ima = IMA.getInstance();
        this.ima.setElements(this.imaAdContainer, this.videoElement, this.src);
        this.ima.appendScript();
    }

    private resume(): void {
        this.ima?.resume();
    }

    private pause(): void {
        this.ima?.pause();
    }

    private mute(): void {
        this.ima?.mute();
    }

    private unmute(): void {
        this.ima?.unmute();
    }

    private skipAd(): void {
        this.ima?.skipAd();
    }
}

customElements.define('player-ad-ima', PlayerAdIma);
