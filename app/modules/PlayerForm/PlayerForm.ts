import { html } from 'utils/generalUtils';
import { isNull, isStringDefined } from 'utils/typeUtils';
import { styles } from 'modules/PlayerForm/PlayerForm.styles';
import { PlayerFormInputNameEnum } from 'modules/PlayerForm/enums/PlayerFormInputNameEnum';
import { ComponentEnum } from 'enums/ComponentEnum';
import { MyAwesomePlayerAttributeEnum } from 'modules/MyAwesomePlayer/enums/MyAwesomePlayerAttributeEnum';

export class PlayerForm extends HTMLFormElement {
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
        return document.getElementsByTagName(ComponentEnum.MyAwesomePlayer)[0] || null;
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

        const rawVolume = formData.get(PlayerFormInputNameEnum.Volume);
        if (!isNull(rawVolume)) {
            const parsedVolume = parseInt(rawVolume as string, 10) / 100;
            contentPlayer.setAttribute(MyAwesomePlayerAttributeEnum.Volume, String(parsedVolume));
        } else {
            contentPlayer.removeAttribute(MyAwesomePlayerAttributeEnum.Volume);
        }

        const isFloatingEnabled = Boolean(formData.get(PlayerFormInputNameEnum.Float));
        if (isFloatingEnabled) {
            contentPlayer.setAttribute(MyAwesomePlayerAttributeEnum.Float, '');
        } else {
            contentPlayer.removeAttribute(MyAwesomePlayerAttributeEnum.Float);
        }
    }

    private render(): void {
        this.innerHTML = html`
            <style>
              ${styles}
            </style>

            <div class="input-container">
                <label for="src-input">Video link:</label>
                <input type="text" id="src-input" name=${PlayerFormInputNameEnum.Src}></input>
                
                <label for="width-input">Width:</label>
                <input type="number" id="width-input" name=${PlayerFormInputNameEnum.Width}></input>

                <label for="autoplay-input">Autoplay</label>
                <input type="checkbox" id="autoplay-input" name=${PlayerFormInputNameEnum.Autoplay}></input>

                <label for="volume-input">Volume:</label>
                <input type="range" id="volume-input" step="1" name=${PlayerFormInputNameEnum.Volume}></input>
                
                <label for="float-input">Player floating:</label>
                <input type="checkbox" id="float-input" name=${PlayerFormInputNameEnum.Float}></input>
              </div>
              
              <button type="submit">Load player with settings applied</button>
        `;
    }
}
