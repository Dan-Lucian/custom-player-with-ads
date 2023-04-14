import html from 'utils/html';
import { isNull, isStringDefined } from 'utils/typeUtils';
import { styles } from 'components/player-form/player-form.styles';
import { PlayerFormInputNameEnum } from 'components/player-form/enums/PlayerFormInputNameEnum';

export default class PlayerForm extends HTMLFormElement {
    private hasRendered = false;

    constructor() {
        super();
        this.addEventListener('submit', PlayerForm.handleSubmit);
    }

    public connectedCallback(): void {
        if (!this.hasRendered) {
            this.render();
            this.hasRendered = true;
        }
    }

    private static getContentPlayer(): Element | null {
        return document.getElementsByTagName('dans-player')[0] || null;
    }

    private static handleSubmit(event: Event): void {
        event.preventDefault();

        const contentPlayer = PlayerForm.getContentPlayer();
        if (isNull(contentPlayer)) {
            return;
        }

        const formData = new FormData(event.target as HTMLFormElement);

        const src = String(formData.get(PlayerFormInputNameEnum.Src));
        if (isStringDefined(src)) {
            contentPlayer.setAttribute(PlayerFormInputNameEnum.Src, src);
        }

        const width = String(formData.get(PlayerFormInputNameEnum.Width));
        if (isStringDefined(width)) {
            contentPlayer.setAttribute(PlayerFormInputNameEnum.Width, width);
        }

        const isAutoplayEnabled = Boolean(formData.get(PlayerFormInputNameEnum.Autoplay));
        if (isAutoplayEnabled) {
            contentPlayer.setAttribute(PlayerFormInputNameEnum.Autoplay, '');
        } else {
            contentPlayer.removeAttribute(PlayerFormInputNameEnum.Autoplay);
        }

        const isMuted = Boolean(formData.get(PlayerFormInputNameEnum.Muted));
        if (isMuted) {
            contentPlayer.setAttribute(PlayerFormInputNameEnum.Muted, '');
        } else {
            contentPlayer.removeAttribute(PlayerFormInputNameEnum.Muted);
        }
    }

    private render(): void {
        this.innerHTML = html`
            <style>
              ${styles}
            </style>

            <label for="src-input">Video link:</label>
            <input type="text" id="src-input" name=${PlayerFormInputNameEnum.Src}></input>
            
            <label for="width-input">Width:</label>
            <input type="number" id="width-input" name=${PlayerFormInputNameEnum.Width}></input>

            <label for="autoplay-input">Autoplay</label>
            <input type="checkbox" id="autoplay-input" name=${PlayerFormInputNameEnum.Autoplay}></input>
            
            <label for="muted-input">Muted:</label>
            <input type="checkbox" id="muted-input" name=${PlayerFormInputNameEnum.Muted}></input>

            <button type="submit">Load</button>
        `;
    }
}

customElements.define('player-form', PlayerForm, { extends: 'form' });
