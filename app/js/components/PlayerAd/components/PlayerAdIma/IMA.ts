import EnumEventIma from '../../../../enums/EnumEventIma';

class IMA {
    private static instance: IMA;

    private URL_SCRIPT = '//imasdk.googleapis.com/js/sdkloader/ima3.js';
    private scriptElement!: HTMLScriptElement;
    private _adContainer: HTMLDivElement | null = null;
    private _videoElement: HTMLVideoElement | null = null;
    private adsLoaded = false;
    private adsLoader?: google.ima.AdsLoader;
    private adsManager?: google.ima.AdsManager;
    private ima!: typeof google.ima;
    private adDisplayContainer!: google.ima.AdDisplayContainer;
    private src = '';

    private get adContainer(): HTMLDivElement {
        if (!this._adContainer) {
            throw new Error('ima: "_adContainer" prop is null.');
        }

        return this._adContainer;
    }

    private get videoElement(): HTMLVideoElement {
        if (!this._videoElement) {
            throw new Error('ima: "_videoElement" prop is null.');
        }

        return this._videoElement;
    }

    private constructor() {}

    public static getInstance(): IMA {
        if (!IMA.instance) {
            IMA.instance = new IMA();
        }

        return IMA.instance;
    }

    public setElements(
        adContainer: HTMLDivElement | null,
        videoElement: HTMLVideoElement | null,
        src: string
    ): void {
        this._adContainer = adContainer;
        this._videoElement = videoElement;
        this.src = src;
    }

    public appendScript(): void {
        if (this.scriptElement) return;

        this.scriptElement = document.createElement('script');
        this.scriptElement.src = this.URL_SCRIPT;
        this.scriptElement.addEventListener('load', () => {
            this.handleScriptLoad();
        });

        // TODO: handle script load error

        // inserted inside body because ima internally uses document.querySelector
        // to check if there is the ima script element, but since we use shadow dom
        // on player-onboarding ima fails to find the script and triggers an error
        document.body.insertAdjacentElement('beforeend', this.scriptElement);
        window.addEventListener('resize', this.handleWindowResize.bind(this));
    }

    private handleScriptLoad(): void {
        this.ima = google.ima;
        this.adDisplayContainer = new this.ima.AdDisplayContainer(
            this.adContainer,
            this.videoElement
        );

        // google docs recommends to have only 1 instance of "adsLoader" per page
        if (!this.adsLoader) {
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

    private handleAdsManagerLoaded(eventAdsManagerLoaded: google.ima.AdsManagerLoadedEvent): void {
        this.adsManager = eventAdsManagerLoaded.getAdsManager(this.videoElement);
        this.adsManager.addEventListener(this.ima.AdEvent.Type.COMPLETE, () => {
            this.adContainer.dispatchEvent(
                new CustomEvent(EnumEventIma.EndAdIma, {
                    bubbles: true,
                    composed: true
                })
            );
        });

        this.playAds();
    }

    private handleAdError(eventAdError: google.ima.AdErrorEvent): void {
        console.log('Error: ', eventAdError.getError());
        if (this.adsManager) {
            this.adsManager.destroy();
        }
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
            console.log('AdsManager could not be started');
            this.adContainer.dispatchEvent(
                new CustomEvent(EnumEventIma.ErrorAdsManager, {
                    bubbles: true,
                    composed: true
                })
            );
        }
    }

    private handleWindowResize(): void {
        console.log('window resize');
        if (this.adsManager) {
            const width = this.videoElement.clientWidth;
            const height = this.videoElement.clientHeight;
            this.adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
        }
    }

    public pause(): void {
        this.adsManager?.pause();
    }

    public resume(): void {
        this.adsManager?.resume();
    }

    public unmute(): void {
        this.adsManager?.setVolume(1);
    }

    public mute(): void {
        this.adsManager?.setVolume(0);
    }

    public skipAd(): void {
        this.adsManager?.skip();
    }
}

export default IMA;
