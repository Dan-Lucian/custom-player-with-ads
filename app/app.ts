import 'css/main.scss';
import { html } from 'utils/generalUtils';
import { IWindowWithPlayerInitialization } from 'interfaces/IWindowWithPlayerInitialization';
import { isNull } from 'utils/typeUtils';
import { ComponentEnum } from 'enums/ComponentEnum';
import { MyAwesomePlayerAttributeEnum } from 'modules/MyAwesomePlayer/enums/MyAwesomePlayerAttributeEnum';
import { IPlayerApi } from 'interfaces/IPlayerApi';

const windowWithPlayerInitialization: IWindowWithPlayerInitialization = window;

windowWithPlayerInitialization.initializePlayer = ({
    cssSelector,
    playlist,
    shouldUseIma,
    isFloatingEnabled,
    volume = 1
}: IPlayerApi): void => {
    const root = document.querySelector(cssSelector);
    const useImaAttribute = shouldUseIma ? MyAwesomePlayerAttributeEnum.UseIma : '';
    const floatingAttribute = isFloatingEnabled ? MyAwesomePlayerAttributeEnum.Float : '';

    const template = html`
        <my-awesome-player
            ${MyAwesomePlayerAttributeEnum.Playlist}=${JSON.stringify(playlist)}
            ${MyAwesomePlayerAttributeEnum.Volume}=${volume}
            ${useImaAttribute}
            ${floatingAttribute}
        >
        </my-awesome-player>

        <h2 class="api-header">Player API</h2>
        <h3 class="ad-blocker-header">Disable AdBlockers if player not working</h3>
        <h3 class="ad-blocker-header">
            If it still doesn't work look in the console for failed requests, it might be that I was
            blocked from those vast resources :(
        </h3>
        <external-buttons></external-buttons>
        <form is=${ComponentEnum.PlayerForm}></form>
    `;

    if (!isNull(root)) {
        root.innerHTML = template;
    } else {
        document.currentScript?.parentElement?.insertAdjacentHTML('beforeend', template);
    }
};
