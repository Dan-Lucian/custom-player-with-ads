import { PlayerEventEnum } from 'enums/PlayerEventEnum';
import { VideoQualityEnum } from 'enums/VideoQualityEnum';
import { html } from 'utils/generalUtils';
import { styles } from 'modules/PlayerControls/components/SettingsMenu/SettingsMenu.styles';
import { ComponentEnum } from 'enums/ComponentEnum';

export default class SettingsMenu extends HTMLElement {
    private isAttached = false;
    private areSettingsVisible = false;
    private dataQualities: VideoQualityEnum[] = [];
    private currentQuality = VideoQualityEnum.Auto;

    private get wrapperSettings(): HTMLElement | null {
        return this.querySelector('#wrapper-settings');
    }

    public static get observedAttributes(): string[] {
        return ['data-qualities'];
    }

    public attributeChangedCallback(property: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) {
            return;
        }

        switch (property) {
            case 'data-qualities':
                this.dataQualities = String(newValue).split(',') as VideoQualityEnum[];
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

            <button class="control-hoverable" is=${ComponentEnum.SettingsButton}></button>
            <div hidden id="wrapper-settings">${this.renderQualityButtons()}</div>
        `;
    }

    private renderQualityButtons(): string {
        return this.dataQualities
            .sort((a, b) => Number.parseInt(b, 10) - Number.parseInt(a, 10))
            .map(
                (quality) => html`<button
                    is=${ComponentEnum.QualityButton}
                    class="${ComponentEnum.QualityButton} ${this.currentQuality === quality
                        ? `${ComponentEnum.QualityButton}--active`
                        : ''}"
                    data-quality="${quality}"
                ></button>`
            )
            .join('');
    }

    private handleClick(event: Event): void {
        const target = event.target as HTMLElement;
        const component = target.closest('[is$="button"]')?.getAttribute('is');

        if (component === ComponentEnum.SettingsButton) {
            this.toggleSettings();
        }

        if (component === ComponentEnum.QualityButton) {
            const quality = target
                .closest('[data-quality]')
                ?.getAttribute('data-quality') as VideoQualityEnum;

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

    private toggleSettings(): void {
        this.areSettingsVisible = !this.areSettingsVisible;

        if (this.areSettingsVisible) {
            this.wrapperSettings?.removeAttribute('hidden');
        } else {
            this.wrapperSettings?.setAttribute('hidden', '');
        }
    }
}
