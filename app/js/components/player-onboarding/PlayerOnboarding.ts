import EnumEvents from '../../enums/EnumEvents';
import './ControlsPlayer';

export default class PlayerOnboarding extends HTMLElement {
    public src = '-';

    public width = 400;

    public height = 300;

    private shadow: ShadowRoot;

    private rendered = false;

    get videoElement(): HTMLMediaElement | null {
        if (this.shadow) {
            return this.shadow.getElementById('player-onboarding') as HTMLMediaElement;
        }

        return null;
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
              <video 
                src=${this.src}
                width=${this.width}
                height=${this.height}
                id="player-onboarding"
              >I'm a player with the src ${this.src}</video>
              <controls-player></controls-player>
            `;
        }
    }

    connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    static get observedAttributes(): string[] {
        return ['src'];
    }

    attributeChangedCallback(property: string, oldValue: string, newValue: string): void {
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
