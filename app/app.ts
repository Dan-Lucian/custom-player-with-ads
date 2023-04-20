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
    shouldUseIma
}): void => {
    const root = document.querySelector(cssSelector);
    const useImaAttribute = shouldUseIma ? MyAwesomePlayerAttributeEnum.UseIma : '';

    const template = html`
        <my-awesome-player playlist=${JSON.stringify(playlist)} ${useImaAttribute}>
        </my-awesome-player>
        <form is=${ComponentEnum.PlayerForm}></form>
    `;

    if (!isNull(root)) {
        root.innerHTML = template;
    } else {
        document.currentScript?.parentElement?.insertAdjacentHTML('beforeend', template);
    }
};
