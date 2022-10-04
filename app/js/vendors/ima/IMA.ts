class IMA {
    private static instance: IMA;

    private URL_SCRIPT = '//imasdk.googleapis.com/js/sdkloader/ima3.js';
    private scriptElement!: HTMLScriptElement;
    private _adContainer: HTMLDivElement | null = null;
    private _parentElement: HTMLElement | null = null;
    private _videoElement: HTMLVideoElement | null = null;
    private adsLoaded = false;
    private adsLoader?: google.ima.AdsLoader;
    private adsManager?: google.ima.AdsManager;
    private ima!: typeof google.ima;
    private adDisplayContainer!: google.ima.AdDisplayContainer;

    private get adContainer(): HTMLDivElement {
        if (!this._adContainer) {
            throw new Error('ima: "_adContainer" prop is null.');
        }

        return this._adContainer;
    }

    private get parentElement(): HTMLElement {
        if (!this._parentElement) {
            throw new Error('ima: "_parentElement" prop is null.');
        }

        return this._parentElement;
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
        parentElement: HTMLElement | null,
        adContainer: HTMLDivElement | null,
        videoElement: HTMLVideoElement | null
    ): void {
        this._parentElement = parentElement;
        this._adContainer = adContainer;
        this._videoElement = videoElement;
    }

    public appendScript(): void {
        if (this.scriptElement) return;

        this.scriptElement = document.createElement('script');
        this.scriptElement.src = this.URL_SCRIPT;
        this.scriptElement.addEventListener('load', () => {
            this.handleScriptLoad();
        });

        // TODO: handle script load error

        this.parentElement?.insertAdjacentElement('beforeend', this.scriptElement);
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
            adsRequest.adTagUrl =
                'https://pubads.g.doubleclick.net/gampad/ads?' +
                'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
                'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
                'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';

            adsRequest.linearAdSlotWidth = this.videoElement.clientWidth;
            adsRequest.linearAdSlotHeight = this.videoElement.clientHeight;
            adsRequest.nonLinearAdSlotWidth = this.videoElement.clientWidth;
            adsRequest.nonLinearAdSlotHeight = this.videoElement.clientHeight / 3;

            this.adsLoader.requestAds(adsRequest);
        }
    }

    private handleAdsManagerLoaded(eventAdsManagerLoaded: google.ima.AdsManagerLoadedEvent): void {
        this.adsManager = eventAdsManagerLoaded.getAdsManager(this.videoElement);
    }

    private handleAdError(eventAdError: google.ima.AdErrorEvent): void {
        console.log('Error: ', eventAdError.getError());
        if (this.adsManager) {
            this.adsManager.destroy();
        }
    }

    public playAds(event: Event): void {
        if (this.adsLoaded) {
            return;
        }

        this.adsLoaded = true;

        event.preventDefault();
        console.log('loading ads through ima');
        console.log('adDisplayContainer', this.adDisplayContainer);
        console.log('this.videoElement: ', this.videoElement);

        // Initialize the container. Must be done via a user action on mobile devices.
        this.adDisplayContainer.initialize();

        const width = this.videoElement.clientWidth;
        const height = this.videoElement.clientHeight;
        try {
            console.log('this.adsManager: ', this.adsManager);
            this.adsManager?.init(width, height, this.ima.ViewMode.NORMAL);
            this.adsManager?.start();
        } catch (error: unknown) {
            console.log('AdsManager could not be started');
            // resume play if ad loading error
            // this.videoElement.play();
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
}

export default IMA;
