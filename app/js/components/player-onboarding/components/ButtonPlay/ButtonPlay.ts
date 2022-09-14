import styles from './ButtonPlay.module';

// console.log('styles: ', styles);

export default class ButtonPlay extends HTMLButtonElement {
    private rendered = false;

    private render(): void {
        this.innerHTML = '<span class="button">Play</span>';
    }

    public connectedCallback(): void {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
}

customElements.define('button-play', ButtonPlay, { extends: 'button' });
