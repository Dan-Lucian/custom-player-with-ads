import { VpaidViewModeEnum } from 'modules/VpaidWrapper/enums/VpaidViewModeEnum';

export interface IVpaidCreative {
    handshakeVersion: (version: string) => string;
    initAd: (
        width: number,
        height: number,
        viewMode: VpaidViewModeEnum,
        desiredBitrate: number,
        creativeData: { prop: string } | null,
        environmentVars: {
            videoSlot?: HTMLVideoElement;
            slot: HTMLDivElement | null;
            videoSlotCanAutoPlay: boolean;
        } | null
    ) => void;
    startAd: () => void;
    subscribe: (handler: () => void, event: string) => void;
    resumeAd: () => void;
    pauseAd: () => void;
    skipAd: () => void;
    adRemainingTime: string;
    set adVolume(volume: number);
    get adVolume(): number;
}
