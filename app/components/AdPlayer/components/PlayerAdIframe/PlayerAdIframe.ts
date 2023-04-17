import { IIframeWindow } from 'interfaces/IIframeWindow';
import { EnumEventPlayerAd } from 'enums/AdPlayerEventEnum';
import styles from './PlayerAdIframe.styles';
import '../ControlsPlayerAd';
import WrapperVPAID from './WrapperVPAID';

export default class PlayerAdIframe extends HTMLElement {
    private dataSrc = '';
    private rendered = false;
    private wrapperVPAID: WrapperVPAID | null = null;

    constructor() {
        super();

        this.addEventListener(EnumEventPlayerAd.Play, this.play);
        this.addEventListener(EnumEventPlayerAd.Pause, this.pause);
        this.addEventListener(EnumEventPlayerAd.Mute, this.mute);
        this.addEventListener(EnumEventPlayerAd.Unmute, this.unmute);
        this.addEventListener(EnumEventPlayerAd.SkipAd, this.skipAd);
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
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    private render(): void {
        console.log('RENDER: <player-ad-iframe>');
        const styleElement = document.createElement('style');
        styleElement.innerHTML = styles;

        const slotAd = document.createElement('div');
        slotAd.id = 'slot-ad';

        const controlsPlayerAd = document.createElement('controls-player-ad');
        controlsPlayerAd.setAttribute('autoplay', '');

        const iframe = document.createElement('iframe');
        iframe.onload = (): void => this.handleIframeLoad(iframe, slotAd);

        this.replaceChildren(styleElement, iframe, slotAd, controlsPlayerAd);
    }

    private handleIframeLoad(iframe: HTMLIFrameElement, slotAd: HTMLDivElement): void {
        if (iframe.contentDocument) {
            const scriptVPAID = document.createElement('script');
            scriptVPAID.src = this.dataSrc;
            scriptVPAID.onload = (): void => {
                const VPAID = (iframe.contentWindow as IIframeWindow).getVPAIDAd();

                this.wrapperVPAID = new WrapperVPAID(VPAID, this, slotAd);
                this.wrapperVPAID.init();
            };

            iframe.contentDocument.head.replaceChildren(scriptVPAID);
        }
    }

    private mute(): void {
        this.wrapperVPAID?.mute();
    }

    private pause(): void {
        this.wrapperVPAID?.pause();
    }

    private play(): void {
        this.wrapperVPAID?.play();
    }

    private skipAd(): void {
        this.wrapperVPAID?.skipAd();
    }

    private unmute(): void {
        this.wrapperVPAID?.unmute();
    }
}

customElements.define('player-ad-iframe', PlayerAdIframe);
