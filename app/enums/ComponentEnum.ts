/*
 * ComponentsEnum is used whenever we have to address a component.
 * IMPORTANT: do not use it inside template values as tags (html`` and css``) because it will
 * cancel all the benefits lit-plugin gives (intelisense, go to definition, fired events yb the component etc.)
 * You can still use inside templates for anything except as tags, for example ids.
 */
export enum ComponentEnum {
    MyAwesomePlayer = 'my-awesome-player',
    PlayerForm = 'player-form',
    ExternalButtons = 'external-buttons',
    PlayerControls = 'player-controls',
    PlayButton = 'play-button',
    PauseButton = 'pause-button',
    MuteButton = 'mute-button',
    UnmuteButton = 'unmute-button',
    PlayNextButton = 'play-next-button',
    PlayPreviousButton = 'play-previous-button',
    SettingsMenu = 'settings-menu',
    SettingsButton = 'settings-button',
    SoundSlider = 'sound-slider',
    QualityButton = 'quality-button',
    AdPlayer = 'ad-player',
    VideoAdPlayer = 'video-ad-player',
    ImaAdPlayer = 'ima-ad-player',
    VpaidAdPlayer = 'vpaid-ad-player',
    AdPlayerControls = 'ad-player-controls',
    MuteAdButton = 'mute-ad-button',
    UnmuteAdButton = 'unmute-ad-button',
    PlayAdButton = 'play-ad-button',
    PauseAdButton = 'pause-ad-button',
    SkipAdButton = 'skip-ad-button'
}
