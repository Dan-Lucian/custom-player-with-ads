import { html } from 'utils/generalUtils';
// eslint-disable-next-line max-len
import { QualityButtonAttributeEnum } from 'modules/PlayerControls/components/SettingsMenu/components/QualityButton/enums/QualityButtonAttributeEnum';
import { TAttributeValue } from 'types/TAttributeValue';

export class QualityButton extends HTMLButtonElement {
    private isAttached = false;
    private quality: string | null = null;

    public static get observedAttributes(): string[] {
        return [QualityButtonAttributeEnum.Quality];
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
            case QualityButtonAttributeEnum.Quality:
                this.quality = newValue;
                break;

            default:
                break;
        }

        if (!this.isAttached) {
            return;
        }
        this.render();
    }

    public connectedCallback(): void {
        if (!this.isAttached) {
            this.render();
            this.isAttached = true;
        }
    }

    private render(): void {
        this.innerHTML = html`${this.quality}`;
    }
}
