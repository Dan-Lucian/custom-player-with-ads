import { PlayerEventEnum } from 'enums/PlayerEventEnum';
import { VpaidEventEnum } from 'enums/VpaidEventEnum';
import { IVPAIDCreative } from 'interfaces/IVpaidCreative';

export default class WrapperVPAID {
    private VPAID: IVPAIDCreative | null = null;
    private nodeCurrent: HTMLElement | null = null;
    private nodeSlot: HTMLDivElement | null = null;

    constructor(VPAID: IVPAIDCreative, nodeCurrent: HTMLElement, nodeSlot: HTMLDivElement) {
        this.VPAID = VPAID;
        this.nodeCurrent = nodeCurrent;
        this.nodeSlot = nodeSlot;

        if (this.VPAID) {
            this.VPAID.subscribe(this.handleAdLoaded.bind(this), VpaidEventEnum.AdLoaded);
            this.VPAID.subscribe(WrapperVPAID.handleAdStarted, VpaidEventEnum.AdStarted);
            this.VPAID.subscribe(
                this.handleAdVideoComplete.bind(this),
                VpaidEventEnum.AdVideoComplete
            );
        }
    }

    public get version(): string {
        return this.VPAID?.handshakeVersion('2.0') || '';
    }

    public init(): void {
        this.VPAID?.initAd(
            Number(this.nodeSlot?.style.width),
            Number(this.nodeSlot?.style.height),
            'normal',
            5000,
            null,
            {
                slot: this.nodeSlot,
                videoSlotCanAutoPlay: false
            }
        );
    }

    public mute(): void {
        if (this.VPAID) {
            // seems like changing volume is not supported since the first getter value is undefined
            console.log('setting volume to 0 from current: ', this.VPAID.adVolume);
            this.VPAID.adVolume = 0;
        }
    }

    public unmute(): void {
        if (this.VPAID) {
            console.log('setting volume to 1 from curent:', this.VPAID.adVolume);
            this.VPAID.adVolume = 1;
        }
    }

    public pause(): void {
        this.VPAID?.pauseAd();
    }

    public play(): void {
        this.VPAID?.resumeAd();
    }

    public skipAd(): void {
        this.VPAID?.skipAd();
        this.nodeCurrent?.dispatchEvent(
            new CustomEvent(PlayerEventEnum.SkipAd, {
                bubbles: true,
                composed: true
            })
        );
    }

    private static handleAdStarted(): void {
        console.log('SUBSCRIPTION HEARD: AdStarted');
    }

    private handleAdLoaded(): void {
        console.log('SUBSCRIPTION HEARD: AdLoaded');
        this.VPAID?.startAd();
    }

    private handleAdVideoComplete(): void {
        console.log('EVENT DISPTACHED: end-ad');
        this.nodeCurrent?.dispatchEvent(
            new CustomEvent(PlayerEventEnum.EndAd, {
                bubbles: true,
                composed: true
            })
        );
    }
}
