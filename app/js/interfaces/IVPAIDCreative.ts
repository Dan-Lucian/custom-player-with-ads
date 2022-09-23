/* eslint-disable no-unused-vars */
interface VPAIDCreative {
    handshakeVersion: (version: string) => string;
    initAd: (
        width: number,
        height: number,
        viewMode: 'normal' | 'thumbnail' | 'fullscreen',
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

export default VPAIDCreative;
