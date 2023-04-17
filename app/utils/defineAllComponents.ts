import { MyAwesomePlayer } from 'components/MyAwesomePlayer/MyAwesomePlayer';
import { AdPlayer } from 'components/AdPlayer/AdPlayer';
import { PlayerForm } from 'components/PlayerForm/PlayerForm';
import { ComponentsEnum } from 'enums/ComponentsEnum';

export function defineAllComponents(): void {
    customElements.define(ComponentsEnum.AdPlayer, AdPlayer);
    customElements.define(ComponentsEnum.PlayerForm, PlayerForm, { extends: 'form' });
    customElements.define(ComponentsEnum.MyAwesomePlayer, MyAwesomePlayer);
}
