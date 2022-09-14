import EnumEvents from '../../enums/EnumEvents';
import './ButtonPlay';
import './ButtonStop';

export default class PlayerOnboarding extends HTMLElement {
    public src = '-';

    private shadow: ShadowRoot | null = null;

    private rendered = false;

    private isPlaying = false;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        this.addEventListener(EnumEvents.PlayPlayerOnboarding, this.play);
        this.addEventListener(EnumEvents.StopPlayerOnboarding, this.stop);
    }

    private render(): void {
        console.log('this.isPlaying: ', this.isPlaying);

        if (this.shadow) {
            this.shadow.innerHTML = `
              <video src=${this.src}>I'm a player with the src ${this.src}</video>
              ${this.isPlaying ? '<button-stop></button-stop>' : '<button-play></button-play>'}
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
        this.isPlaying = true;
        this.render();
    }

    private stop(): void {
        console.log('EVENT HEARD: ', EnumEvents.StopPlayerOnboarding);
        this.isPlaying = false;
        this.render();
    }
}

customElements.define('player-onboarding', PlayerOnboarding);
