import { PlayerEventEnum } from 'enums/PlayerEventEnum';
import { VideoQualityEnum } from 'enums/VideoQualityEnum';
import 'modules/MyAwesomePlayer/components/ControlsPlayer/components/MenuSettings/ButtonSettings';
import 'modules/MyAwesomePlayer/components/ControlsPlayer/components/MenuSettings/ButtonQuality';
import { html } from 'utils/generalUtils';
import { styles } from 'modules/MyAwesomePlayer/components/ControlsPlayer/components/MenuSettings/MenuSettings.styles';

export default class MenuSettings extends HTMLElement {
    private rendered = false;
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
        if (oldValue === newValue) return;

        switch (property) {
            case 'data-qualities':
                this.dataQualities = String(newValue).split(',') as VideoQualityEnum[];
                break;

            default:
                break;
        }

        if (!this.rendered) return;
        this.render();
    }

    constructor() {
        super();
        this.addEventListener('pointerdown', this.handleClick);
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    private render(): void {
        this.innerHTML = html`
            <style>
                ${styles}
            </style>

            <button class="control-hoverable" is="button-settings"></button>
            <div hidden id="wrapper-settings">${this.renderButtonsQuality()}</div>
        `;
    }

    private renderButtonsQuality(): string {
        return this.dataQualities
            .sort((a, b) => Number.parseInt(b, 10) - Number.parseInt(a, 10))
            .map(
                (quality) => html`<button
                    is="button-quality"
                    class="button-quality ${this.currentQuality === quality
                        ? 'button-quality--active'
                        : ''}"
                    data-quality="${quality}"
                ></button>`
            )
            .join('');
    }

    private handleClick(event: Event): void {
        const target = event.target as HTMLElement;
        const is = target.closest('[is|="button"]')?.getAttribute('is');

        if (is === 'button-settings') {
            this.toggleSettings();
        }

        if (is === 'button-quality') {
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

customElements.define('menu-settings', MenuSettings);
