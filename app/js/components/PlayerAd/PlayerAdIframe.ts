import styles from './PlayerAdIframe.styles';
import './ButtonSkip';
import IWindowIframe from '../../interfaces/IWindowIframe';
import EnumEventVPAID from '../../enums/EnumEventVPAID';
import EnumEventPlayer from '../../enums/EnumEventPlayer';

export default class PlayerAdIframe extends HTMLElement {
    private rendered = false;

    private dataSrc = '';

    static get observedAttributes(): string[] {
        return ['data-src'];
    }

    get controllerElement(): HTMLElement {
        return this.closest('player-ad') as HTMLElement;
    }

    private render(): void {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = styles;

        const slotAd = document.createElement('div');
        slotAd.id = 'slot-ad';

        const iframe = document.createElement('iframe');
        iframe.onload = (): void => {
            if (iframe.contentDocument) {
                const scriptVPAID = document.createElement('script');
                scriptVPAID.src = this.dataSrc;
                scriptVPAID.onload = (): void => {
                    const VPAIDCreative = (iframe.contentWindow as IWindowIframe).getVPAIDAd();
                    console.log('VPAIDCreative: ', VPAIDCreative);

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

        this.replaceChildren(styleElement, iframe, slotAd);
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
}

customElements.define('player-ad-iframe', PlayerAdIframe);
