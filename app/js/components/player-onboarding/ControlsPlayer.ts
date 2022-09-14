import EnumEvents from '../../enums/EnumEvents';
import './components/ButtonPlay';
import './ButtonStop';
import './ButtonMute';
import './ButtonUnmute';

export default class ControlsPlayer extends HTMLElement {
    private rendered = false;

    private isPlaying = false;

    private isMuted = false;

    constructor() {
        super();
        this.addEventListener('click', this.handleClick);
    }

    private render(): void {
        this.innerHTML = `
          ${
              this.isPlaying
                  ? '<button is="button-stop"></button>'
                  : '<button is="button-play"></button>'
          }
          ${
              this.isMuted
                  ? '<button is="button-unmute"></button>'
                  : '<button is="button-mute"></button>'
          }
        `;
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }

    private handleClick(event: Event): void {
        const target = event.target as HTMLElement;
        const is = target.getAttribute('is');

        if (is === 'button-play') {
            console.log('EVENT DISPATCHED: ', EnumEvents.PlayPlayerOnboarding);
            this.dispatchEvent(
                new CustomEvent(EnumEvents.PlayPlayerOnboarding, {
                    bubbles: true,
                    composed: true
                })
            );
            this.isPlaying = true;
            this.render();
        }

        if (is === 'button-stop') {
            console.log('EVENT DISPATCHED: ', EnumEvents.StopPlayerOnboarding);
            this.dispatchEvent(
                new CustomEvent(EnumEvents.StopPlayerOnboarding, {
                    bubbles: true,
                    composed: true
                })
            );
            this.isPlaying = false;
            this.render();
        }

        if (is === 'button-mute') {
            console.log('EVENT DISPATCHED: ', EnumEvents.MutePlayerOnboarding);
            this.dispatchEvent(
                new CustomEvent(EnumEvents.MutePlayerOnboarding, {
                    bubbles: true,
                    composed: true
                })
            );
            this.isMuted = true;
            this.render();
        }

        if (is === 'button-unmute') {
            console.log('EVENT DISPATCHED: ', EnumEvents.UnmutePlayerOnboarding);
            this.dispatchEvent(
                new CustomEvent(EnumEvents.UnmutePlayerOnboarding, {
                    bubbles: true,
                    composed: true
                })
            );
            this.isMuted = false;
            this.render();
        }
    }
}

customElements.define('controls-player', ControlsPlayer);
