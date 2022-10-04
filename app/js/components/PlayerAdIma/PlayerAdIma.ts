import html from '../../utils/html';
import IMA from './IMA';
import styles from './PlayerAdIma.styles';
import EnumEventPlayerAd from '../../enums/EnumEventPlayerAd';

export default class PlayerAdIma extends HTMLElement {
    private dataSrc = '';
    private rendered = false;

    private get imaAdContainer(): HTMLDivElement | null {
        return this.querySelector('#ima-ad-container') as HTMLDivElement | null;
    }

    private get videoElement(): HTMLVideoElement | null {
        return this.closest('#player-container')?.querySelector(
            '#player-onboarding'
        ) as HTMLVideoElement | null;
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

    constructor() {
        super();

        this.addEventListener(EnumEventPlayerAd.PlayPlayerAd, this.play);
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
            <controls-player-ad></controls-player-ad>
        `;
    }

    private setupIMA(): void {
        const ima = IMA.getInstance();
        ima.setElements(this.imaAdContainer, this.videoElement);
        ima.appendScript();
    }

    private playAds(): void {
        const ima = IMA.getInstance();
        ima.playAds();
    }

    private mute(): void {
        console.log('muting ima player');
    }

    private unmute(): void {
        console.log('unmuting ima player');
    }

    private play(): void {
        console.log('playing ima player');
    }

    private pause(): void {
        console.log('pausing ima player');
    }

    private skipAd(): void {
        console.log('skping ad ima player');
    }
}

customElements.define('player-ad-ima', PlayerAdIma);
