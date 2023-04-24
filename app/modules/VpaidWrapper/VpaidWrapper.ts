import { PlayerEventEnum } from 'enums/PlayerEventEnum';
import { VpaidEventEnum } from 'modules/VpaidWrapper/enums/VpaidEventEnum';
import { IVpaidCreative } from 'modules/VpaidWrapper/interfaces/IVpaidCreative';
import { VpaidWrapperConfig } from 'modules/VpaidWrapper/config/VpaidWrapperConfig';
import { VpaidViewModeEnum } from 'modules/VpaidWrapper/enums/VpaidViewModeEnum';

export class VpaidWrapper {
    private vpaidCreative: IVpaidCreative;
    private currentElement: HTMLElement;
    private slotElement: HTMLDivElement;

    constructor(
        vpaidCreative: IVpaidCreative,
        currentElement: HTMLElement,
        slotElement: HTMLDivElement
    ) {
        this.vpaidCreative = vpaidCreative;
        this.currentElement = currentElement;
        this.slotElement = slotElement;

        this.vpaidCreative.subscribe(this.handleAdLoaded.bind(this), VpaidEventEnum.AdLoaded);
        this.vpaidCreative.subscribe(VpaidWrapper.handleAdStarted, VpaidEventEnum.AdStarted);
        this.vpaidCreative.subscribe(
            this.handleAdVideoComplete.bind(this),
            VpaidEventEnum.AdVideoComplete
        );
    }

    public get version(): string | null {
        return this.vpaidCreative.handshakeVersion(VpaidWrapperConfig.SUPPORTED_VERSION) || null;
    }

    public init(): void {
        this.vpaidCreative.initAd(
            Number(this.slotElement.style.width),
            Number(this.slotElement.style.height),
            VpaidViewModeEnum.Normal,
            5000,
            null,
            {
                slot: this.slotElement,
                videoSlotCanAutoPlay: false
            }
        );
    }

    public mute(): void {
        // seems like changing volume is not supported since the first getter value is undefined
        console.log(`VpaidWrapper_setting_volume_from_${this.vpaidCreative.adVolume}_to_0`);
        this.vpaidCreative.adVolume = 0;
    }

    public unmute(): void {
        console.log(`VpaidWrapper_setting_volume_from_${this.vpaidCreative.adVolume}_to_1`);
        this.vpaidCreative.adVolume = 1;
    }

    public pause(): void {
        this.vpaidCreative.pauseAd();
    }

    public play(): void {
        this.vpaidCreative.resumeAd();
    }

    public skipAd(): void {
        this.vpaidCreative.skipAd();
        this.currentElement.dispatchEvent(
            new CustomEvent(PlayerEventEnum.SkipAd, {
                bubbles: true,
                composed: true
            })
        );
    }

    private static handleAdStarted(): void {
        console.log('VpaidWrapper_AdStarted');
    }

    private handleAdLoaded(): void {
        console.log('VpaidWrapper_AdLoaded');
        this.vpaidCreative.startAd();
    }

    private handleAdVideoComplete(): void {
        console.log(`VpaidWrapper_${PlayerEventEnum.EndAd}`);
        this.currentElement.dispatchEvent(
            new CustomEvent(PlayerEventEnum.EndAd, {
                bubbles: true,
                composed: true
            })
        );
    }
}
