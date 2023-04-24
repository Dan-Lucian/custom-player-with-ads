import { html } from 'utils/generalUtils';
import { ComponentEnum } from 'enums/ComponentEnum';
import { AdPlayerEventEnum } from 'enums/AdPlayerEventEnum';
import { styles } from 'modules/AdPlayer/components/ImaAdPlayer/ImaAdPlayer.styles';
import { ImaAdPlayerAttributeEnum } from 'modules/AdPlayer/components/ImaAdPlayer/enums/ImaAdPlayerAttributeEnum';
import { ImaLoader } from 'modules/ImaLoader/ImaLoader';
import { TAttributeValue } from 'types/TAttributeValue';
import { isNull } from 'utils/typeUtils';

export class ImaAdPlayer extends HTMLElement {
    private isAttached = false;
    private _src: string | null = null;
    private _imaLoader: ImaLoader | null = null;

    private get src(): string {
        if (isNull(this._src)) {
            throw new Error('ImaAdPlayer__src_prop_is_null');
        }

        return this._src;
    }

    private get imaLoader(): ImaLoader {
        if (isNull(this._imaLoader)) {
            throw new Error('ImaAdPlayer__imaLoader_prop_is_null');
        }

        return this._imaLoader;
    }

    private get imaAdContainer(): HTMLDivElement {
        return this.querySelector('#ima-ad-container') as HTMLDivElement;
    }

    private get videoElement(): HTMLVideoElement {
        return this.closest('#player-container')?.querySelector(
            `#${ComponentEnum.MyAwesomePlayer}`
        ) as HTMLVideoElement;
    }

    public static get observedAttributes(): string[] {
        return [ImaAdPlayerAttributeEnum.Src];
    }

    public async attributeChangedCallback(
        attribute: string,
        oldValue: TAttributeValue,
        newValue: TAttributeValue
    ): Promise<void> {
        if (oldValue === newValue) {
            return;
        }

        switch (attribute) {
            case ImaAdPlayerAttributeEnum.Src:
                this._src = newValue;
                break;

            default:
                break;
        }

        if (!this.isAttached) {
            return;
        }
        this.render();
    }

    constructor() {
        super();

        this.addEventListener(AdPlayerEventEnum.Play, this.resume);
        this.addEventListener(AdPlayerEventEnum.Pause, this.pause);
        this.addEventListener(AdPlayerEventEnum.Mute, this.mute);
        this.addEventListener(AdPlayerEventEnum.Unmute, this.unmute);
        this.addEventListener(AdPlayerEventEnum.SkipAd, this.skipAd);
    }

    public connectedCallback(): void {
        if (!this.isAttached) {
            this.render();
            this.setupIma();
            this.isAttached = true;
        }
    }

    private render(): void {
        console.log(`RENDER: <${ComponentEnum.ImaAdPlayer}>`);
        this.innerHTML = html`
            <style>
                ${styles}
            </style>

            <div id="ima-ad-container"></div>
            <ad-player-controls autoplay></ad-player-controls>
        `;
    }

    private setupIma(): void {
        this._imaLoader = ImaLoader.getInstance();
        this.imaLoader.setElements(this.imaAdContainer, this.videoElement, this.src);
        this.imaLoader.appendScript();
    }

    private resume(): void {
        this.imaLoader.resume();
    }

    private pause(): void {
        this.imaLoader.pause();
    }

    private mute(): void {
        this.imaLoader.mute();
    }

    private unmute(): void {
        this.imaLoader.unmute();
    }

    private skipAd(): void {
        this.imaLoader.skipAd();
    }
}
