/* eslint-disable max-len */
import {
    addEventListenersUsingArray,
    html,
    removeEventListenersUsingArray
} from 'utils/generalUtils';
import { styles } from 'modules/PlayerControls/components/SoundSlider/SoundSlider.styles';
import { TAttributeValue } from 'types/TAttributeValue';
import { isString } from 'utils/typeUtils';
import { SoundSliderAttributeEnum } from 'modules/PlayerControls/components/SoundSlider/enums/SoundSliderAttributeEnum';
import { SoundSliderEventEnum } from 'modules/PlayerControls/components/SoundSlider/enums/SoundSliderEventEnum';
import { IEventListener } from 'interfaces/IEventListener';
import { IVolumeChangeDetail } from 'interfaces/IVolumeChangeDetail';

export class SoundSlider extends HTMLElement {
    private isAttached = false;
    private volume = 1;
    private eventListeners: IEventListener[] = [];

    public static get observedAttributes(): string[] {
        return [SoundSliderAttributeEnum.Volume];
    }

    constructor() {
        super();
        console.log('CREATING NEW SLIDER');
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
            case SoundSliderAttributeEnum.Volume:
                if (isString(newValue)) {
                    this.volume = parseFloat(newValue);
                } else {
                    this.volume = 1;
                }
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
            this.addEventListeners();
        }
    }

    public disconnectedCallback(): void {
        this.removeEventListeners();
    }

    private render(): void {
        this.innerHTML = html`
            <style>
                ${styles}
            </style>

            <div class="sound-slider-wrapper">
                <input
                    id="sound-slider-input"
                    class="sound-slider"
                    type="range"
                    value=${this.volume * 100}
                    step="1"
                />
            </div>
        `;
    }

    private addEventListeners(): void {
        this.eventListeners.push({
            element: this,
            event: 'input',
            callback: this.handleInput.bind(this)
        });
        addEventListenersUsingArray(this.eventListeners);
    }

    private removeEventListeners(): void {
        removeEventListenersUsingArray(this.eventListeners);
    }

    private handleInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const volume = parseInt(input.value, 10) / 100;

        this.dispatchEvent(
            new CustomEvent<IVolumeChangeDetail>(SoundSliderEventEnum.VolumeChange, {
                bubbles: true,
                detail: { volume }
            })
        );
    }
}
