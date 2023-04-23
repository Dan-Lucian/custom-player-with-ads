import { PlayerEventEnum } from 'enums/PlayerEventEnum';
import { VideoQualityEnum } from 'enums/VideoQualityEnum';
import { html } from 'utils/generalUtils';
import { styles } from 'modules/PlayerControls/components/SettingsMenu/SettingsMenu.styles';
import { ComponentEnum } from 'enums/ComponentEnum';
// eslint-disable-next-line max-len
import { SettingsMenuAttributeEnum } from 'modules/PlayerControls/components/SettingsMenu/enums/SettingsMenuAttributeEnum';
// eslint-disable-next-line max-len
import { QualityButtonAttributeEnum } from 'modules/PlayerControls/components/SettingsMenu/components/QualityButton/enums/QualityButtonAttributeEnum';
import { TAttributeValue } from 'types/TAttributeValue';
import { isNull } from 'utils/typeUtils';

export class SettingsMenu extends HTMLElement {
    private isAttached = false;
    private areSettingsVisible = false;
    private streamingQualities: VideoQualityEnum[] = [];
    private currentQuality = VideoQualityEnum.Auto;

    public static get observedAttributes(): string[] {
        return [SettingsMenuAttributeEnum.Qualities];
    }

    private static parseQualitiesAttributeValue(value: TAttributeValue): VideoQualityEnum[] {
        if (isNull(value)) {
            return [VideoQualityEnum.Auto];
        }

        const qualities = value.split(',');
        const supportedQualities = Object.values(VideoQualityEnum);

        return qualities.filter((quality) =>
            supportedQualities.includes(quality as VideoQualityEnum)
        ) as VideoQualityEnum[];
    }

    public attributeChangedCallback(
        attribute: string,
        oldValue: TAttributeValue,
        newValue: TAttributeValue
    ): void {
        if (oldValue === newValue) {
            return;
        }

        switch (attribute) {
            case SettingsMenuAttributeEnum.Qualities:
                this.streamingQualities = SettingsMenu.parseQualitiesAttributeValue(newValue);
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
        this.addEventListener('pointerdown', this.handleClick);
    }

    public connectedCallback(): void {
        if (!this.isAttached) {
            this.render();
            this.isAttached = true;
        }
    }

    private render(): void {
        this.innerHTML = html`
            <style>
                ${styles}
            </style>

            <button class="hoverable-control" is=${ComponentEnum.SettingsButton}></button>
            <div hidden id="settings-wrapper">${this.renderQualityButtons()}</div>
        `;
    }

    private renderQualityButtons(): string {
        return this.streamingQualities
            .sort((a, b) => Number.parseInt(b, 10) - Number.parseInt(a, 10))
            .map(
                (quality) => html`<button
                    is=${ComponentEnum.QualityButton}
                    class="${ComponentEnum.QualityButton} ${this.currentQuality === quality
                        ? `${ComponentEnum.QualityButton}--active`
                        : ''}"
                    ${QualityButtonAttributeEnum.Quality}="${quality}"
                ></button>`
            )
            .join('');
    }

    private handleClick(event: Event): void {
        const target = event.target as HTMLElement;
        const component = target.closest('[is$="button"]')?.getAttribute('is');

        switch (component) {
            case ComponentEnum.SettingsButton:
                this.toggleSettings();
                break;

            case ComponentEnum.QualityButton:
                this.toggleQuality(target);
                break;

            default:
        }
    }

    private toggleSettings(): void {
        const settingsWrapperElement = this.querySelector('#settings-wrapper');
        if (isNull(settingsWrapperElement)) {
            return;
        }

        this.areSettingsVisible = !this.areSettingsVisible;
        if (this.areSettingsVisible) {
            settingsWrapperElement.removeAttribute('hidden');
        } else {
            settingsWrapperElement.setAttribute('hidden', '');
        }
    }

    private toggleQuality(target: HTMLElement): void {
        const quality = target
            .closest(`[${QualityButtonAttributeEnum.Quality}]`)
            ?.getAttribute(QualityButtonAttributeEnum.Quality) as VideoQualityEnum;

        this.toggleSettings();
        this.dispatchEvent(
            new CustomEvent(PlayerEventEnum.ChangeStreamingQuality, {
                bubbles: true,
                composed: true,
                detail: { quality }
            })
        );
        this.currentQuality = quality;
        this.render();
    }
}
