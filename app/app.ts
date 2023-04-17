import 'css/main.scss';
import 'components/MyAwesomePlayer/MyAwesomePlayer';
import 'components/PlayerForm/PlayerForm';
import html from 'utils/html';
import { IWindowWithPlayerInitialization } from 'interfaces/IWindowWithPlayerInitialization';
import { isNull } from 'utils/typeUtils';
import { ComponentsEnum } from 'enums/ComponentsEnum';

const windowWithPlayerInitialization: IWindowWithPlayerInitialization = window;

windowWithPlayerInitialization.initializePlayer = ({ selector, playlist, useIma }): void => {
    const root = document.querySelector(selector);
    const dataUseIma = useIma ? 'data-use-ima' : '';

    const template = html`
        <${ComponentsEnum.MyAwesomePlayer}
            playlist=${JSON.stringify(playlist)} ${dataUseIma}>
        </${ComponentsEnum.MyAwesomePlayer}>
        <form is=${ComponentsEnum.PlayerForm}></form>
    `;

    if (!isNull(root)) {
        root.innerHTML = template;
    } else {
        document.currentScript?.parentElement?.insertAdjacentHTML('beforeend', template);
    }
};
