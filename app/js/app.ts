import html from './utils/html';
import '../css/main.scss';
import './components/PlayerOnboarding';
import './components/FormPlayer';
import IWindowWithPlayerInitialization from './interfaces/IWindowWithPlayerInitialization';

const windowWithPlayerInitialization: IWindowWithPlayerInitialization = window;

windowWithPlayerInitialization.initializePlayer = ({ selector, playlist, useIma }): void => {
    const root = document.querySelector(selector);
    const dataUseIma = useIma ? 'data-use-ima' : '';

    const template = html`
        <player-onboarding playlist=${JSON.stringify(playlist)} ${dataUseIma}></player-onboarding>
        <form is="form-player"></form>
    `;

    if (root) {
        root.innerHTML = template;
    } else {
        document.currentScript?.parentElement?.insertAdjacentHTML('beforeend', template);
    }
};
