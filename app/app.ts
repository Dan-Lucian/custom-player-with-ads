import 'css/main.scss';
import 'components/MyAwesomePlayer/MyAwesomePlayer';
import 'components/PlayerForm/PlayerForm';
import { html } from 'utils/generalUtils';
import { IWindowWithPlayerInitialization } from 'interfaces/IWindowWithPlayerInitialization';
import { isNull } from 'utils/typeUtils';
import { ComponentsEnum } from 'enums/ComponentsEnum';
import { MyAwesomePlayerAttributeEnum } from 'components/MyAwesomePlayer/enums/MyAwesomePlayerAttributeEnum';

const windowWithPlayerInitialization: IWindowWithPlayerInitialization = window;

windowWithPlayerInitialization.initializePlayer = ({
    cssSelector,
    playlist,
    shouldUseIma
}): void => {
    const root = document.querySelector(cssSelector);
    const useImaAttribute = shouldUseIma ? MyAwesomePlayerAttributeEnum.UseIma : '';

    const template = html`
        <${ComponentsEnum.MyAwesomePlayer}
            playlist=${JSON.stringify(playlist)} ${useImaAttribute}>
        </${ComponentsEnum.MyAwesomePlayer}>
        <form is=${ComponentsEnum.PlayerForm}></form>
    `;

    if (!isNull(root)) {
        root.innerHTML = template;
    } else {
        document.currentScript?.parentElement?.insertAdjacentHTML('beforeend', template);
    }
};
