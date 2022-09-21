import styles from './PlayerAdIframe.styles';
import './ButtonSkip';
import IWindowIframe from '../../interfaces/IWindowIframe';

export default class PlayerAdIframe extends HTMLElement {
    private rendered = false;

    private dataSrc = '';

    static get observedAttributes(): string[] {
        return ['data-src'];
    }

    get slotAd(): Element | null {
        return this.closest('player-ad') || null;
    }

    constructor() {
        super();
        this.addEventListener('AdLoaded', () => {
            console.log('EVENT: AdLoaded');
        });

        this.addEventListener('AdStarted', () => {
            console.log('EVENT: AdStarted');
        });
    }

    private render(): void {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = styles;

        const slotAd = document.createElement('div');
        slotAd.id = 'slot-ad';

        const slotVideo = document.createElement('video');
        slotVideo.id = 'slot-video';

        slotAd.appendChild(slotVideo);

        const iframe = document.createElement('iframe');
        // iframe.setAttribute('sandbox', '');
        iframe.onload = (): void => {
            if (iframe.contentDocument) {
                const scriptVPAID = document.createElement('script');
                scriptVPAID.src = this.dataSrc;
                scriptVPAID.onload = (): void => {
                    const VPAIDCreative = (iframe.contentWindow as IWindowIframe).getVPAIDAd();

                    const versionVPAID = VPAIDCreative.handshakeVersion();
                    console.log('handshake: versionVPAID: ', versionVPAID);

                    VPAIDCreative.initAd(
                        Number(slotAd.style.width),
                        Number(slotAd.style.height),
                        'normal',
                        5000,
                        null,
                        {
                            videoSlot: slotVideo,
                            slot: slotAd,
                            videoSlotCanAutoPlay: true
                        }
                    );

                    setTimeout(() => VPAIDCreative.startAd());
                    console.log('VPAIDCreative: ', VPAIDCreative);
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
