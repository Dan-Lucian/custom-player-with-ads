import 'css/main.scss';
import { html } from 'utils/generalUtils';
import { IWindowWithPlayerInitialization } from 'interfaces/IWindowWithPlayerInitialization';
import { isNull } from 'utils/typeUtils';
import { ComponentEnum } from 'enums/ComponentEnum';
import { MyAwesomePlayerAttributeEnum } from 'modules/MyAwesomePlayer/enums/MyAwesomePlayerAttributeEnum';

const windowWithPlayerInitialization: IWindowWithPlayerInitialization = window;

windowWithPlayerInitialization.initializePlayer = ({
    cssSelector,
    playlist,
    shouldUseIma,
    isFloatingEnabled
}): void => {
    const root = document.querySelector(cssSelector);
    const useImaAttribute = shouldUseIma ? MyAwesomePlayerAttributeEnum.UseIma : '';
    const floatingAttribute = isFloatingEnabled ? MyAwesomePlayerAttributeEnum.Float : '';

    const template = html`
        <my-awesome-player
            playlist=${JSON.stringify(playlist)}
            ${useImaAttribute}
            ${floatingAttribute}
        >
        </my-awesome-player>

        <h2 class="api-header">Player API</h2>
        <external-buttons></external-buttons>
        <form is=${ComponentEnum.PlayerForm}></form>
    `;

    if (!isNull(root)) {
        root.innerHTML = template;
    } else {
        document.currentScript?.parentElement?.insertAdjacentHTML('beforeend', template);
    }
};
