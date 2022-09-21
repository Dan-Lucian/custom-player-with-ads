interface VPAIDCreative {
    handshakeVersion: () => void;
    initAd: (
        width: number,
        height: number,
        viewMode: 'normal' | 'thumbnail' | 'fullscreen',
        desiredBitrate: number,
        creativeData: Object | null,
        environmentVars: {
            videoSlot?: HTMLVideoElement;
            slot?: HTMLDivElement;
            videoSlotCanAutoPlay: boolean;
        } | null
    ) => void;
    startAd: () => void;
    subscribe: (handler: () => void, event: string) => void;
    resumeAd: () => void;
    pauseAd: () => void;
    skipAd: () => void;
}

export default VPAIDCreative;
