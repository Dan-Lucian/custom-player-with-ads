import { MyAwesomePlayer } from 'modules/MyAwesomePlayer/MyAwesomePlayer';
import { AdPlayer } from 'modules/AdPlayer/AdPlayer';
import { PlayerForm } from 'modules/PlayerForm/PlayerForm';
import { ExternalButtons } from 'modules/ExternalButtons/ExternalButtons';
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
import { SettingsMenu } from 'modules/PlayerControls/components/SettingsMenu/SettingsMenu';
import { QualityButton } from 'modules/PlayerControls/components/SettingsMenu/components/QualityButton/QualityButton';
import { SettingsButton } from 'modules/PlayerControls/components/SettingsMenu/components/SettingsButton';
import { VideoAdPlayer } from 'modules/AdPlayer/components/VideoAdPlayer/VideoAdPlayer';
import { AdPlayerControls } from 'modules/AdPlayer/components/AdPlayerControls/AdPlayerControls';
import { MuteAdButton } from 'modules/AdPlayer/components/AdPlayerControls/components/MuteAdButton';
import { UnmuteAdButton } from 'modules/AdPlayer/components/AdPlayerControls/components/UnmuteAdButton';
import { PlayAdButton } from 'modules/AdPlayer/components/AdPlayerControls/components/PlayAdButton';
import { PauseAdButton } from 'modules/AdPlayer/components/AdPlayerControls/components/PauseAdButton';
import { SkipAdButton } from 'modules/AdPlayer/components/AdPlayerControls/components/SkipAdButton';
import { ImaAdPlayer } from 'modules/AdPlayer/components/ImaAdPlayer/ImaAdPlayer';
import { VpaidAdPlayer } from 'modules/AdPlayer/components/VpaidAdPlayer/VpaidAdPlayer';

export class ComponentsDefiner {
    // TODO: add .whenDefined
    public static defineAllComponents(): void {
        // top level components
        customElements.define(ComponentEnum.MyAwesomePlayer, MyAwesomePlayer);
        customElements.define(ComponentEnum.PlayerForm, PlayerForm, { extends: 'form' });
        customElements.define(ComponentEnum.ExternalButtons, ExternalButtons);

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
        customElements.define(ComponentEnum.SettingsMenu, SettingsMenu);
        customElements.define(ComponentEnum.QualityButton, QualityButton, { extends: 'button' });
        customElements.define(ComponentEnum.SettingsButton, SettingsButton, { extends: 'button' });

        // AdPlayer components
        customElements.define(ComponentEnum.AdPlayer, AdPlayer);
        customElements.define(ComponentEnum.VideoAdPlayer, VideoAdPlayer);
        customElements.define(ComponentEnum.ImaAdPlayer, ImaAdPlayer);
        customElements.define(ComponentEnum.VpaidAdPlayer, VpaidAdPlayer);

        // AdPlayer controls element
        customElements.define(ComponentEnum.AdPlayerControls, AdPlayerControls);
        customElements.define(ComponentEnum.MuteAdButton, MuteAdButton, { extends: 'button' });
        customElements.define(ComponentEnum.UnmuteAdButton, UnmuteAdButton, { extends: 'button' });
        customElements.define(ComponentEnum.PlayAdButton, PlayAdButton, { extends: 'button' });
        customElements.define(ComponentEnum.PauseAdButton, PauseAdButton, { extends: 'button' });
        customElements.define(ComponentEnum.SkipAdButton, SkipAdButton, { extends: 'button' });
    }
}
