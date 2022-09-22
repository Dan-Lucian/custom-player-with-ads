import EnumEventPlayer from '../../enums/EnumEventPlayer';
import EnumEventVPAID from '../../enums/EnumEventVPAID';
import IVPAIDCreative from '../../interfaces/IVPAIDCreative';

export default class WrapperVPAID {
    private VPAID: IVPAIDCreative | null = null;
    private nodeCurrent: HTMLElement | null = null;
    private nodeSlot: HTMLDivElement | null = null;

    constructor(VPAID: IVPAIDCreative, nodeCurrent: HTMLElement, nodeSlot: HTMLDivElement) {
        this.VPAID = VPAID;
        this.nodeCurrent = nodeCurrent;
        this.nodeSlot = nodeSlot;

        if (this.VPAID) {
            this.VPAID.subscribe(this.handleAdLoaded.bind(this), EnumEventVPAID.AdLoaded);
            this.VPAID.subscribe(WrapperVPAID.handleAdStarted, EnumEventVPAID.AdStarted);
            this.VPAID.subscribe(
                this.handleAdVideoComplete.bind(this),
                EnumEventVPAID.AdVideoComplete
            );
        }
    }

    public get versionVPAID(): string {
        return this.VPAID?.handshakeVersion() || '';
    }

    public static handleAdStarted(): void {
        console.log('EVENT CAUGHT: AdStarted');
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
                videoSlotCanAutoPlay: true
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

    public pause(): void {
        this.VPAID?.pauseAd();
    }

    public play(): void {
        this.VPAID?.resumeAd();
    }

    public skipAd(): void {
        this.VPAID?.skipAd();
        this.nodeCurrent?.dispatchEvent(
            new CustomEvent(EnumEventPlayer.SkipAdPlayerOnboarding, {
                bubbles: true,
                composed: true
            })
        );
    }

    public unmute(): void {
        if (this.VPAID) {
            console.log('setting volume to 1 from curent:', this.VPAID.adVolume);
            this.VPAID.adVolume = 1;
        }
    }

    private handleAdLoaded(): void {
        this.VPAID?.startAd();
    }

    private handleAdVideoComplete(): void {
        console.log('EVENT DISPTACHED: end-ad');
        this.nodeCurrent?.dispatchEvent(
            new CustomEvent(EnumEventPlayer.EndAd, {
                bubbles: true,
                composed: true
            })
        );
    }
}
