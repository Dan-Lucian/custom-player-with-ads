/*
 * ComponentsEnum is used whenever we have to address a component.
 * IMPORTANT: do not use it inside template values as tags (html`` and css``) because it will
 * cancel all the benefits lit-plugin gives (intelisense, go to definition, fired events yb the component etc.)
 * You can still use inside templates for anything except as tags, for example ids.
 */
export enum ComponentEnum {
    MyAwesomePlayer = 'my-awesome-player',
    PlayerForm = 'player-form',
    AdPlayer = 'ad-player',
    PlayerControls = 'player-controls'
}
