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
}

export default VPAIDCreative;
