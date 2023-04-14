import '../css/main.scss';
import 'components/PlayerOnboarding';
import 'components/player-form/player-form';
import html from 'utils/html';
import IWindowWithPlayerInitialization from 'interfaces/IWindowWithPlayerInitialization';
import { isNull } from 'utils/typeUtils';

const windowWithPlayerInitialization: IWindowWithPlayerInitialization = window;

windowWithPlayerInitialization.initializePlayer = ({ selector, playlist, useIma }): void => {
    const root = document.querySelector(selector);
    const dataUseIma = useIma ? 'data-use-ima' : '';

    const template = html`
        <player-onboarding playlist=${JSON.stringify(playlist)} ${dataUseIma}></player-onboarding>
        <form is="player-form"></form>
    `;

    if (!isNull(root)) {
        root.innerHTML = template;
    } else {
        document.currentScript?.parentElement?.insertAdjacentHTML('beforeend', template);
    }
};
