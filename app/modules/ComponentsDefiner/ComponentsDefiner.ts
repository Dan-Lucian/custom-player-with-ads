import { MyAwesomePlayer } from 'modules/MyAwesomePlayer/MyAwesomePlayer';
import { AdPlayer } from 'modules/AdPlayer/AdPlayer';
import { PlayerForm } from 'modules/PlayerForm/PlayerForm';
import { ComponentEnum } from 'enums/ComponentEnum';
import { PlayerControls } from 'modules/PlayerControls/PlayerControls';
import { UnmuteButton } from 'modules/PlayerControls/components/UnmuteButton';
import { PlayPreviousButton } from 'modules/PlayerControls/components/PlayPreviousButton';
import { PlayNextButton } from 'modules/PlayerControls/components/PlayNextButton';
import { PlayButton } from 'modules/PlayerControls/components/PlayButton';
import { PauseButton } from 'modules/PlayerControls/components/PauseButton';
import { MuteButton } from 'modules/PlayerControls/components/MuteButton';
import { LoadImaAdButton } from 'modules/PlayerControls/components/LoadImaAdButton';
import { LoadAdButton } from 'modules/PlayerControls/components/LoadAdButton';
import SettingsMenu from 'modules/PlayerControls/components/SettingsMenu/SettingsMenu';
import { QualityButton } from 'modules/PlayerControls/components/SettingsMenu/QualityButton';
import { SettingsButton } from 'modules/PlayerControls/components/SettingsMenu/SettingsButton';

export class ComponentsDefiner {
    // TODO: add .whenDefined
    public static defineAllComponents(): void {
        customElements.define(ComponentEnum.AdPlayer, AdPlayer);
        customElements.define(ComponentEnum.PlayerForm, PlayerForm, { extends: 'form' });
        customElements.define(ComponentEnum.MyAwesomePlayer, MyAwesomePlayer);

        // player controls components
        customElements.define(ComponentEnum.PlayerControls, PlayerControls);
        customElements.define(ComponentEnum.UnmuteButton, UnmuteButton, { extends: 'button' });
        customElements.define(ComponentEnum.PlayPreviousButton, PlayPreviousButton, {
            extends: 'button'
        });
        customElements.define(ComponentEnum.PlayNextButton, PlayNextButton, { extends: 'button' });
        customElements.define(ComponentEnum.PlayButton, PlayButton, { extends: 'button' });
        customElements.define(ComponentEnum.PauseButton, PauseButton, { extends: 'button' });
        customElements.define(ComponentEnum.MuteButton, MuteButton, { extends: 'button' });
        customElements.define(ComponentEnum.LoadImaAdButton, LoadImaAdButton, {
            extends: 'button'
        });
        customElements.define(ComponentEnum.LoadAdButton, LoadAdButton, {
            extends: 'button'
        });
        customElements.define(ComponentEnum.SettingsMenu, SettingsMenu);
        customElements.define(ComponentEnum.QualityButton, QualityButton, { extends: 'button' });
        customElements.define(ComponentEnum.SettingsButton, SettingsButton, { extends: 'button' });
    }
}
