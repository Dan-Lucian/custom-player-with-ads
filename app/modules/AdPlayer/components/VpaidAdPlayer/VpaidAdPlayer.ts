import { IVpaidWindow } from 'modules/VpaidWrapper/interfaces/IVpaidWindow';
import { AdPlayerEventEnum } from 'modules/AdPlayer/enums/AdPlayerEventEnum';
import { ComponentEnum } from 'enums/ComponentEnum';
import { VpaidWrapper } from 'modules/VpaidWrapper/VpaidWrapper';
import { styles } from 'modules/AdPlayer/components/VpaidAdPlayer/VpaidAdPlayer.styles';
import { VpaidAdPlayerAttributeEnum } from 'modules/AdPlayer/components/VpaidAdPlayer/enums/VpaidAdPlayerAttributeEnum';
import { TAttributeValue } from 'types/TAttributeValue';
import { isNull } from 'utils/typeUtils';
import { AdPlayerControlsAttributeEnum } from '../AdPlayerControls/enums/AdPlayerControlsAttributeEnum';

export class VpaidAdPlayer extends HTMLElement {
    private isAttached = false;
    private _src: string | null = null;
    private _vpaidWrapper: VpaidWrapper | null = null;

    private get src(): string {
        if (isNull(this._src)) {
            throw new Error('VpaidAdPlayer_this._src_is_null');
        }

        return this._src;
    }

    private get vpaidWrapper(): VpaidWrapper {
        if (isNull(this._vpaidWrapper)) {
            throw new Error('VpaidAdPlayer_this._vpaidWrapper_is_null');
        }

        return this._vpaidWrapper;
    }

    constructor() {
        super();

        this.addEventListener(AdPlayerEventEnum.Play, this.play);
        this.addEventListener(AdPlayerEventEnum.Pause, this.pause);
        this.addEventListener(AdPlayerEventEnum.Mute, this.mute);
        this.addEventListener(AdPlayerEventEnum.Unmute, this.unmute);
        this.addEventListener(AdPlayerEventEnum.SkipAd, this.skipAd);
    }

    public static get observedAttributes(): string[] {
        return [VpaidAdPlayerAttributeEnum.Src];
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
            case VpaidAdPlayerAttributeEnum.Src:
                this._src = newValue;
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
        console.log(`RENDER: <${ComponentEnum.VpaidAdPlayer}>`);
        const styleElement = document.createElement('style');
        styleElement.innerHTML = styles;

        const adSlot = document.createElement('div');
        adSlot.id = 'ad-slot';

        const adPlayerControls = document.createElement(ComponentEnum.AdPlayerControls);
        adPlayerControls.setAttribute(AdPlayerControlsAttributeEnum.Autoplay, '');

        const iframe = document.createElement('iframe');
        iframe.onload = (): void => this.handleIframeLoad(iframe, adSlot);

        this.replaceChildren(styleElement, iframe, adSlot, adPlayerControls);
    }

    private handleIframeLoad(iframe: HTMLIFrameElement, slotAd: HTMLDivElement): void {
        if (isNull(iframe.contentDocument)) {
            throw new Error('VpaidAdPlayer_iframe.contentDocument_is_null');
        }

        const vpaidScriptElement = document.createElement('script');
        vpaidScriptElement.src = this.src;
        vpaidScriptElement.onload = (): void => {
            const vpaid = (iframe.contentWindow as IVpaidWindow).getVPAIDAd();

            this._vpaidWrapper = new VpaidWrapper(vpaid, this, slotAd);
            this.vpaidWrapper.init();
        };

        iframe.contentDocument.head.replaceChildren(vpaidScriptElement);
    }

    private mute(): void {
        this.vpaidWrapper.mute();
    }

    private pause(): void {
        this.vpaidWrapper.pause();
    }

    private play(): void {
        this.vpaidWrapper.play();
    }

    private skipAd(): void {
        this.vpaidWrapper.skipAd();
    }

    private unmute(): void {
        this.vpaidWrapper.unmute();
    }
}
