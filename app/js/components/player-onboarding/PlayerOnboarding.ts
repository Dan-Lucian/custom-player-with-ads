import EnumEvents from '../../enums/EnumEvents';
import './ControlsPlayer';
import styles from './PlayerOnboarding.styles';

export default class PlayerOnboarding extends HTMLElement {
    public src = '-';

    public width = 500;

    public height?: number;

    private shadow: ShadowRoot;

    private rendered = false;

    get videoElement(): HTMLMediaElement | null {
        if (this.shadow) {
            return this.shadow.getElementById('player-onboarding') as HTMLMediaElement;
        }

        return null;
    }

    static get observedAttributes(): string[] {
        return ['src'];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        this.addEventListener(EnumEvents.PlayPlayerOnboarding, this.play);
        this.addEventListener(EnumEvents.StopPlayerOnboarding, this.stop);
        this.addEventListener(EnumEvents.MutePlayerOnboarding, this.mute);
        this.addEventListener(EnumEvents.UnmutePlayerOnboarding, this.unmute);
    }

    private render(): void {
        if (this.shadow) {
            this.shadow.innerHTML = `
              <style>
                ${styles}
              </style>

              <video 
                src=${this.src}
                width=${this.width}
                height=${this.height}
                id="player-onboarding"
              >Player not supported</video>
              <controls-player></controls-player>
            `;
        }
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    public attributeChangedCallback(property: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) return;

        if (property === 'src') {
            this[property] = newValue;
            this.render();
        }
    }

    private play(): void {
        console.log('EVENT HEARD: ', EnumEvents.PlayPlayerOnboarding);
        this.videoElement?.play();
    }

    private stop(): void {
        console.log('EVENT HEARD: ', EnumEvents.StopPlayerOnboarding);
        this.videoElement?.pause();
    }

    private mute(): void {
        console.log('EVENT HEARD: ', EnumEvents.MutePlayerOnboarding);
        if (this.videoElement) {
            this.videoElement.muted = true;
        }
    }

    private unmute(): void {
        console.log('EVENT HEARD: ', EnumEvents.UnmutePlayerOnboarding);
        if (this.videoElement) {
            this.videoElement.muted = false;
        }
    }
}

customElements.define('player-onboarding', PlayerOnboarding);
