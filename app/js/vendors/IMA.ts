class IMA {
    private static instance: IMA;

    private URL = '//imasdk.googleapis.com/js/sdkloader/ima3.js';
    private scriptElement: HTMLScriptElement | null = null;
    private adContainer: HTMLDivElement | null = null;
    private parentElement: HTMLElement | null = null;
    private adsLoaded = false;

    private constructor(parentElement: HTMLElement, adContainer: HTMLDivElement) {
        this.parentElement = parentElement;
        this.adContainer = adContainer;
        console.log('parentElement: ', parentElement);
        console.log('adContainer: ', adContainer);
        console.log('constructing: ');
    }

    public static getInstance(parentElement?: HTMLElement, adContainer?: HTMLDivElement): IMA {
        if (!IMA.instance) {
            if (parentElement && adContainer) {
                IMA.instance = new IMA(parentElement, adContainer);
            } else {
                throw new Error('missing "parentElement" and "adContainer" props');
            }
        }

        return IMA.instance;
    }

    // left at https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side#6.-initialize-the-adsloader-and-make-an-ads-request
    public appendScript(): void {
        if (this.scriptElement) return;

        this.scriptElement = document.createElement('script');
        this.scriptElement.src = this.URL;
        this.scriptElement.onload = (): void => this.initializeIMA();

        this.parentElement?.insertAdjacentElement('beforeend', this.scriptElement);
    }

    private initializeIMA(): void {
        console.log('this.adContainer', this.adContainer);
    }
}

export default IMA;
