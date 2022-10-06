import Hls, { Events, ManifestParsedData } from 'hls.js';
import EnumQualityVideo from '../../../enums/EnumQualityVideo';

class WrapperHls {
    private static instance: WrapperHls;

    private hls?: Hls;
    private _videoElement: HTMLVideoElement | null = null;
    private src = '';
    private callbackAfterManifestParsed: ((levels: string[]) => void) | null = null;
    private mapQualityToLevel: Map<EnumQualityVideo, number> = new Map();

    private constructor() {}

    private get videoElement(): HTMLVideoElement {
        if (!this._videoElement) {
            throw new Error('ima: "_videoElement" prop is null.');
        }

        return this._videoElement;
    }

    public static getInstance(): WrapperHls {
        if (!WrapperHls.instance) {
            WrapperHls.instance = new WrapperHls();
        }

        return WrapperHls.instance;
    }

    public setConfig(
        videoElement: HTMLVideoElement | null,
        src: string,
        callbackAfterManifestParsed: (levels: string[]) => void
    ): void {
        this._videoElement = videoElement;
        this.src = src;
        this.callbackAfterManifestParsed = callbackAfterManifestParsed;
    }

    public initialize(): void {
        if (Hls.isSupported()) {
            const config = { ...Hls.DefaultConfig, capLevelToPlayerSize: true };
            this.hls = new Hls(config);
            this.hls.loadSource(this.src);
            this.hls.on(Hls.Events.MANIFEST_PARSED, this.handleManifestParsed.bind(this));
            this.hls.attachMedia(this.videoElement);
        } else {
            throw new Error('Hls not supported');
        }
    }

    public loadSource(src: string): void {
        this.hls?.loadSource(src);
    }

    public setQualityTo(quality: EnumQualityVideo): void {
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
        const arrayQualityAndLevel: Array<[EnumQualityVideo, number]> = data.levels.map(
            (level, index) => [String(level.height) as EnumQualityVideo, index]
        );
        arrayQualityAndLevel.push([EnumQualityVideo.Auto, -1]);
        this.mapQualityToLevel = new Map(arrayQualityAndLevel);

        const foundQualities = data.levels.map((level) => String(level.height)).concat('auto');

        if (this.callbackAfterManifestParsed) {
            this.callbackAfterManifestParsed(foundQualities);
        }
        console.log(`WRAPPER_HLS: quality levels found: `, foundQualities);
    }
}

export default WrapperHls;
