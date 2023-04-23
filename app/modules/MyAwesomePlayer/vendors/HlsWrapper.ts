import Hls, { Events, ManifestParsedData } from 'hls.js';
import { VideoQualityEnum } from 'enums/VideoQualityEnum';
import { isDefined } from 'utils/typeUtils';

export class HlsWrapper {
    private static instance: HlsWrapper;

    private hls?: Hls;
    private callbackAfterManifestParsed: ((levels: string[]) => void) | null = null;
    private mapQualityToLevel: Map<VideoQualityEnum, number> = new Map();

    public static getInstance(): HlsWrapper {
        if (!isDefined(HlsWrapper.instance)) {
            HlsWrapper.instance = new HlsWrapper();
        }

        return HlsWrapper.instance;
    }

    public initialize(
        videoElement: HTMLVideoElement,
        src: string,
        callbackAfterManifestParsed: (levels: string[]) => void
    ): void {
        this.callbackAfterManifestParsed = callbackAfterManifestParsed;

        if (Hls.isSupported()) {
            const config = { ...Hls.DefaultConfig, capLevelToPlayerSize: true };
            this.hls = new Hls(config);
            this.hls.loadSource(src);
            this.hls.on(Hls.Events.MANIFEST_PARSED, this.handleManifestParsed.bind(this));
            this.hls.attachMedia(videoElement);
        } else {
            throw new Error('HlsWrapper_Hls_not_supported');
        }
    }

    public loadSource(src: string): void {
        this.hls?.loadSource(src);
    }

    public setQualityTo(quality: VideoQualityEnum): void {
        console.log(
            `WRAPPER_HLS: changing quality from ${
                this.hls?.currentLevel
            } to ${this.mapQualityToLevel.get(quality)} (${quality})`
        );
        if (this.hls) {
            this.hls.currentLevel = this.mapQualityToLevel.get(quality) || -1;
        }
    }

    public destroy(): void {
        this.hls?.destroy();
    }

    private handleManifestParsed(event: Events.MANIFEST_PARSED, data: ManifestParsedData): void {
        const arrayQualityAndLevel: Array<[VideoQualityEnum, number]> = data.levels.map(
            (level, index) => [String(level.height) as VideoQualityEnum, index]
        );
        arrayQualityAndLevel.push([VideoQualityEnum.Auto, -1]);
        this.mapQualityToLevel = new Map(arrayQualityAndLevel);

        const foundQualities = data.levels
            .map((level) => String(level.height))
            .concat(VideoQualityEnum.Auto);

        if (this.callbackAfterManifestParsed) {
            this.callbackAfterManifestParsed(foundQualities);
        }
        console.log(`HlsWrapper_quality_levels_found: `, foundQualities);
    }
}
