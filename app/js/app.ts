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

    const scriptIMA = document.createElement('script');
    scriptIMA.src = '//imasdk.googleapis.com/js/sdkloader/ima3.js';

    if (root) {
        root.innerHTML = template;
        root.insertAdjacentElement('beforeend', scriptIMA);
    } else {
        document.currentScript?.parentElement?.insertAdjacentHTML('beforeend', template);
        document.currentScript?.parentElement?.insertAdjacentElement('beforeend', scriptIMA);
    }
};
