import html from './utils/html';
import '../css/main.scss';
import './components/PlayerOnboarding';
import './components/FormPlayer';
import IWindowWithPlayerInitialization from './interfaces/IWindowWithPlayerInitialization';

console.log('FILE: App.ts');

if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode!');
}

const windowWithPlayerInitialization: IWindowWithPlayerInitialization = window;

windowWithPlayerInitialization.initializePlayer = ({ selector, playlist }): void => {
    const root = document.querySelector(selector);
    const template = html`
        <player-onboarding playlist=${playlist.join()}></player-onboarding>
        <form is="form-player"></form>
    `;

    if (root) {
        root.innerHTML = template;
    } else {
        document.currentScript?.parentElement?.insertAdjacentHTML('beforeend', template);
    }
};
