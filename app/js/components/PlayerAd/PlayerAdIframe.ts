import styles from './PlayerAdIframe.styles';
import './ButtonSkipAd';
import './ControlsPlayerAd';
import IWindowIframe from '../../interfaces/IWindowIframe';
import IVPAIDCreative from '../../interfaces/IVPAIDCreative';
import EnumEventVPAID from '../../enums/EnumEventVPAID';
import EnumEventPlayerAd from '../../enums/EnumEventPlayerAd';
import EnumEventPlayer from '../../enums/EnumEventPlayer';

export default class PlayerAdIframe extends HTMLElement {
    private rendered = false;

    private dataSrc = '';

    private VPAIDCreative: IVPAIDCreative | null = null;

    static get observedAttributes(): string[] {
        return ['data-src'];
    }

    constructor() {
        super();

        this.addEventListener(EnumEventPlayerAd.PlayPlayerAd, this.play);
        this.addEventListener(EnumEventPlayerAd.PausePlayerAd, this.pause);
        this.addEventListener(EnumEventPlayerAd.MutePlayerAd, this.mute);
        this.addEventListener(EnumEventPlayerAd.UnmutePlayerAd, this.unmute);
        this.addEventListener(EnumEventPlayerAd.SkipAdPlayerAd, this.skipAd);
    }

    private render(): void {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = styles;

        const slotAd = document.createElement('div');
        slotAd.id = 'slot-ad';

        const controlsPlayerAd = document.createElement('controls-player-ad');
        controlsPlayerAd.setAttribute('autoplay', '');

        const iframe = document.createElement('iframe');
        iframe.onload = (): void => {
            if (iframe.contentDocument) {
                const scriptVPAID = document.createElement('script');
                scriptVPAID.src = this.dataSrc;
                scriptVPAID.onload = (): void => {
                    const VPAIDCreative = (iframe.contentWindow as IWindowIframe).getVPAIDAd();
                    console.log('VPAIDCreative: ', VPAIDCreative);
                    this.VPAIDCreative = VPAIDCreative;

                    const handleAdLoaded = (): void => {
                        VPAIDCreative.startAd();
                    };

                    const handleAdStarted = (): void => {
                        console.log('EVENT CAUGHT: AdStarted');
                    };

                    const handleAdVideoComplete = (): void => {
                        console.log('EVENT DISPTACHED: end-ad');
                        this.dispatchEvent(
                            new CustomEvent(EnumEventPlayer.EndAd, {
                                bubbles: true,
                                composed: true
                            })
                        );
                    };

                    VPAIDCreative.subscribe(handleAdLoaded, EnumEventVPAID.AdLoaded);
                    VPAIDCreative.subscribe(handleAdStarted, EnumEventVPAID.AdStarted);
                    VPAIDCreative.subscribe(handleAdVideoComplete, EnumEventVPAID.AdVideoComplete);

                    const versionVPAID = VPAIDCreative.handshakeVersion();
                    console.log('handshake: versionVPAID: ', versionVPAID);

                    VPAIDCreative.initAd(
                        Number(slotAd.style.width),
                        Number(slotAd.style.height),
                        'normal',
                        5000,
                        null,
                        {
                            slot: slotAd,
                            videoSlotCanAutoPlay: true
                        }
                    );
                };

                iframe.contentDocument.head.replaceChildren(scriptVPAID);
            }
        };

        this.replaceChildren(styleElement, iframe, slotAd, controlsPlayerAd);
    }

    public async connectedCallback(): Promise<void> {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
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

        this.render();
    }

    private play(): void {
        this.VPAIDCreative?.resumeAd();
    }

    private pause(): void {
        this.VPAIDCreative?.pauseAd();
    }

    private mute(): void {
        if (this.VPAIDCreative) {
            // seems like changing volume is not supported since the first getter value is undefined
            console.log('setting volume to 0 from current: ', this.VPAIDCreative.adVolume);
            this.VPAIDCreative.adVolume = 0;
        }
    }

    private unmute(): void {
        if (this.VPAIDCreative) {
            console.log('setting volume to 1 from curent:', this.VPAIDCreative.adVolume);
            this.VPAIDCreative.adVolume = 1;
        }
    }

    private skipAd(): void {
        this.VPAIDCreative?.skipAd();
        this.dispatchEvent(
            new CustomEvent(EnumEventPlayer.SkipAdPlayerOnboarding, {
                bubbles: true,
                composed: true
            })
        );
    }
}

customElements.define('player-ad-iframe', PlayerAdIframe);
