import { MyAwesomePlayer } from 'modules/MyAwesomePlayer/MyAwesomePlayer';
import { AdPlayer } from 'modules/AdPlayer/AdPlayer';
import { PlayerForm } from 'modules/PlayerForm/PlayerForm';
import { ComponentsEnum } from 'enums/ComponentsEnum';

export class ComponentsDefiner {
    public static defineModuleLevelComponents(): void {
        customElements.define(ComponentsEnum.AdPlayer, AdPlayer);
        customElements.define(ComponentsEnum.PlayerForm, PlayerForm, { extends: 'form' });
        customElements.define(ComponentsEnum.MyAwesomePlayer, MyAwesomePlayer);
    }
}
