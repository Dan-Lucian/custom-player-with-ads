import { MyAwesomePlayer } from 'modules/MyAwesomePlayer/MyAwesomePlayer';
import { AdPlayer } from 'modules/AdPlayer/AdPlayer';
import { PlayerForm } from 'modules/PlayerForm/PlayerForm';
import { ComponentEnum } from 'enums/ComponentEnum';
import { PlayerControls } from 'modules/PlayerControls/PlayerControls';

export class ComponentsDefiner {
    // TODO: add .whenDefined
    public static defineAllComponents(): void {
        customElements.define(ComponentEnum.AdPlayer, AdPlayer);
        customElements.define(ComponentEnum.PlayerForm, PlayerForm, { extends: 'form' });
        customElements.define(ComponentEnum.MyAwesomePlayer, MyAwesomePlayer);
        customElements.define(ComponentEnum.PlayerControls, PlayerControls);
    }
}
