import { html } from 'utils/generalUtils';
import { EnumEventPlayerAd } from '../../../../enums/AdPlayerEventEnum';
import './ButtonPlayAd';
import './ButtonPauseAd';
import './ButtonMuteAd';
import './ButtonUnmuteAd';
import './ButtonSkipAd';
import styles from './ControlsPlayerAd.styles';

export default class ControlsPlayerAd extends HTMLElement {
    private isPlaying = false;
    private muted = false;
    private rendered = false;

    constructor() {
        super();
        this.addEventListener('click', this.handleClick);
    }

    public static get observedAttributes(): string[] {
        return ['muted', 'autoplay'];
    }

    public attributeChangedCallback(property: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) {
            return;
        }

        switch (property) {
            case 'autoplay':
                this.isPlaying = !this.isPlaying;
                break;

            case 'muted':
                this.muted = !this.muted;
                break;

            default:
                break;
        }

        if (!this.rendered) {
            return;
        }
        this.render();
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    private render(): void {
        console.log('RENDER: <controls-player-ad>');
        this.innerHTML = html`
            <style>
                ${styles}
            </style>

            ${this.isPlaying
                ? html`<button class="hoverable-control" is="button-pause-ad"></button>`
                : html`<button class="hoverable-control" is="button-play-ad"></button>`}
            ${this.muted
                ? html`<button class="hoverable-control" is="button-unmute-ad"></button>`
                : html`<button class="hoverable-control" is="button-mute-ad"></button>`}
            <div class="spacer"></div>
            <button is="button-skip-ad"></button>
        `;
    }

    private handleClick(event: Event): void {
        const target = event.target as HTMLElement;
        const is = target.closest('[is|="button"]')?.getAttribute('is');

        if (is === 'button-play-ad') {
            this.dispatchEvent(
                new CustomEvent(EnumEventPlayerAd.Play, {
                    bubbles: true
                })
            );
            this.isPlaying = true;
            this.render();

            return;
        }

        if (is === 'button-pause-ad') {
            this.dispatchEvent(
                new CustomEvent(EnumEventPlayerAd.Pause, {
                    bubbles: true
                })
            );
            this.isPlaying = false;
            this.render();

            return;
        }

        if (is === 'button-mute-ad') {
            this.dispatchEvent(
                new CustomEvent(EnumEventPlayerAd.Mute, {
                    bubbles: true
                })
            );
            this.muted = true;
            this.render();

            return;
        }

        if (is === 'button-unmute-ad') {
            this.dispatchEvent(
                new CustomEvent(EnumEventPlayerAd.Unmute, {
                    bubbles: true
                })
            );
            this.muted = false;
            this.render();
        }
    }
}

customElements.define('controls-player-ad', ControlsPlayerAd);
