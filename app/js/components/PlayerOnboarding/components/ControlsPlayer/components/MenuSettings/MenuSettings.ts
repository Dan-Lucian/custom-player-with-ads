import html from '../../../../../../utils/html';
import styles from './MenuSettings.styles';
import './ButtonSettings';
import './ButtonQuality';
import EnumEventPlayer from '../../../../../../enums/EnumEventPlayer';
import EnumQualityVideo from '../../../../../../enums/EnumQualityVideo';

export default class MenuSettings extends HTMLElement {
    private rendered = false;
    private areSettingsVisible = false;
    private dataQualities: EnumQualityVideo[] = [];
    private currentQuality = EnumQualityVideo.Auto;

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
                this.dataQualities = String(newValue).split(',') as EnumQualityVideo[];
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
                ?.getAttribute('data-quality') as EnumQualityVideo;

            this.toggleSettings();
            this.dispatchEvent(
                new CustomEvent(EnumEventPlayer.ChangeQualityPlayerOnboarding, {
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
