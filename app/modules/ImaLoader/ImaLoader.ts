import { ImaEventEnum } from 'enums/ImaEventEnum';
import { isDefined, isNull } from 'utils/typeUtils';
import { ImaLoaderConfig } from 'modules/ImaLoader/config/ImaLoaderConfig';

export class ImaLoader {
    private static instance?: ImaLoader;

    private _adContainer: HTMLDivElement | null = null;
    private _videoElement: HTMLVideoElement | null = null;
    private _src: string | null = null;

    private adsLoaded = false;
    private adDisplayContainer!: google.ima.AdDisplayContainer;
    private ima!: typeof google.ima;
    private adsLoader?: google.ima.AdsLoader;
    private adsManager?: google.ima.AdsManager;
    private scriptElement?: HTMLScriptElement;

    private get adContainer(): HTMLDivElement {
        if (isNull(this._adContainer)) {
            throw new Error('ImaLoader__adContainer_prop_is_null');
        }

        return this._adContainer;
    }

    private get videoElement(): HTMLVideoElement {
        if (isNull(this._videoElement)) {
            throw new Error('ImaLoader__videoElement_prop_is_null');
        }

        return this._videoElement;
    }

    private get src(): string {
        if (isNull(this._src)) {
            throw new Error('ImaLoader__src_prop_is_null');
        }

        return this._src;
    }

    public static getInstance(): ImaLoader {
        if (!isDefined(ImaLoader.instance)) {
            ImaLoader.instance = new ImaLoader();
        }

        return ImaLoader.instance;
    }

    public setElements(
        adContainer: HTMLDivElement,
        videoElement: HTMLVideoElement,
        src: string
    ): void {
        this._adContainer = adContainer;
        this._videoElement = videoElement;
        this._src = src;
    }

    public appendScript(): void {
        if (isDefined(this.scriptElement)) {
            return;
        }

        this.scriptElement = document.createElement('script');
        this.scriptElement.src = ImaLoaderConfig.SDK_URL;
        this.scriptElement.addEventListener('load', () => {
            this.handleScriptLoad();
        });

        // TODO: handle script load error

        // inserted inside body because ima internally uses document.querySelector
        // to check if there is the ima script element, but since we use shadow dom
        // on my-awesome-player ima fails to find the script and triggers an error
        document.body.insertAdjacentElement('beforeend', this.scriptElement);
        window.addEventListener('resize', this.handleWindowResize.bind(this));
    }

    public pause(): void {
        this.adsManager?.pause();
    }

    public resume(): void {
        this.adsManager?.resume();
    }

    public mute(): void {
        this.adsManager?.setVolume(0);
    }

    public unmute(): void {
        this.adsManager?.setVolume(1);
    }

    public skipAd(): void {
        this.adsManager?.skip();
    }

    public playAds(): void {
        if (this.adsLoaded) {
            return;
        }

        this.adsLoaded = true;

        // Initialize the container. Must be done via a user action on mobile devices.
        this.adDisplayContainer.initialize();

        const width = this.videoElement.clientWidth;
        const height = this.videoElement.clientHeight;
        try {
            this.adsManager?.init(width, height, this.ima.ViewMode.NORMAL);
            this.adsManager?.start();
        } catch (error: unknown) {
            console.log('ImaLoader_AdsManager_could_not_be_started');
            this.adContainer.dispatchEvent(
                new CustomEvent(ImaEventEnum.AdsManagerError, {
                    bubbles: true,
                    composed: true
                })
            );
        }
    }

    private handleScriptLoad(): void {
        this.ima = google.ima;
        this.adDisplayContainer = new this.ima.AdDisplayContainer(
            this.adContainer,
            this.videoElement
        );

        // google docs recommends to have only 1 instance of "adsLoader" per page
        if (!isDefined(this.adsLoader)) {
            this.adsLoader = new this.ima.AdsLoader(this.adDisplayContainer);
            this.adsLoader.addEventListener(
                this.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
                this.handleAdsManagerLoaded.bind(this) as google.ima.AdsManagerLoadedEvent.Listener
            );
            this.adsLoader.addEventListener(
                this.ima.AdErrorEvent.Type.AD_ERROR,
                this.handleAdError.bind(this) as google.ima.AdErrorEvent.Listener
            );

            this.videoElement.addEventListener('ended', () => {
                if (this.adsLoader) {
                    this.adsLoader.contentComplete();
                }
            });

            // const contentEndedListener = (): void => {
            //     this.adsLoader?.contentComplete();
            // };

            // this.videoElement.onended = contentEndedListener;

            const adsRequest = new google.ima.AdsRequest();
            adsRequest.adTagUrl = this.src;

            adsRequest.linearAdSlotWidth = this.videoElement.clientWidth;
            adsRequest.linearAdSlotHeight = this.videoElement.clientHeight;
            adsRequest.nonLinearAdSlotWidth = this.videoElement.clientWidth;
            adsRequest.nonLinearAdSlotHeight = this.videoElement.clientHeight / 3;

            this.adsLoader.requestAds(adsRequest);
        }
    }

    private handleAdError(eventAdError: google.ima.AdErrorEvent): void {
        console.log('ImaLoader_', eventAdError.getError());
        if (isDefined(this.adsManager)) {
            this.adsManager.destroy();
        }
    }

    private handleAdsManagerLoaded(eventAdsManagerLoaded: google.ima.AdsManagerLoadedEvent): void {
        this.adsManager = eventAdsManagerLoaded.getAdsManager(this.videoElement);

        this.adsManager.addEventListener(this.ima.AdEvent.Type.COMPLETE, () => {
            this.adContainer.dispatchEvent(
                new CustomEvent(ImaEventEnum.AdEnd, {
                    bubbles: true,
                    composed: true
                })
            );
        });

        this.adsManager.addEventListener(this.ima.AdEvent.Type.SKIPPED, () => {
            this.adContainer.dispatchEvent(
                new CustomEvent(ImaEventEnum.AdSkip, {
                    bubbles: true,
                    composed: true
                })
            );
        });

        this.playAds();
    }

    private handleWindowResize(): void {
        console.log('ImaLoader_handleWindowResize');
        if (isDefined(this.adsManager)) {
            const width = this.videoElement.clientWidth;
            const height = this.videoElement.clientHeight;
            this.adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
        }
    }
}
