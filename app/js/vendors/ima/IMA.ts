class IMA {
    private static instance: IMA;

    private URL_SCRIPT = '//imasdk.googleapis.com/js/sdkloader/ima3.js';
    private scriptElement!: HTMLScriptElement;
    private adContainer!: HTMLDivElement;
    private parentElement!: HTMLElement;
    private videoElement!: HTMLVideoElement;
    private adsLoaded = false;
    private adsLoader?: google.ima.AdsLoader;
    private adsManager?: google.ima.AdsManager;
    private ima!: typeof google.ima;
    private adDisplayContainer!: google.ima.AdDisplayContainer;

    private constructor(
        parentElement: HTMLElement,
        adContainer: HTMLDivElement,
        videoElement: HTMLVideoElement
    ) {
        this.parentElement = parentElement;
        this.adContainer = adContainer;
        this.videoElement = videoElement;
    }

    public static getInstance(
        parentElement?: HTMLElement,
        adContainer?: HTMLDivElement,
        videoElement?: HTMLVideoElement
    ): IMA {
        if (!IMA.instance) {
            if (parentElement && adContainer && videoElement) {
                IMA.instance = new IMA(parentElement, adContainer, videoElement);
            } else {
                throw new Error('missing "parentElement", "adContainer" and "videoElement" props');
            }
        }

        return IMA.instance;
    }

    public appendScript(): void {
        if (this.scriptElement) return;

        this.scriptElement = document.createElement('script');
        this.scriptElement.src = this.URL_SCRIPT;
        this.scriptElement.addEventListener('load', () => {
            this.handleScriptLoad();
        });

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
