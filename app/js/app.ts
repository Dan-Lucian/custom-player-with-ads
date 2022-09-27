import html from './utils/html';
import '../css/main.scss';
import './components/PlayerOnboarding';
import './components/FormPlayer';
import video from '../assets/video.mp4';
import IWindowWithPlayerInitialization from './interfaces/IWindowWithPlayerInitialization';

if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode!');
}

const windowWithPlayerInitialization: IWindowWithPlayerInitialization = window;

windowWithPlayerInitialization.initializePlayer = (): void => {
    const whenLoaded = Promise.all([
        customElements.whenDefined('player-onboarding'),
        customElements.whenDefined('form-player')
    ]);

    whenLoaded.then(() => {
        const root = document.getElementById('root');
        if (root) {
            root.innerHTML = html`
                <player-onboarding src=${video}></player-onboarding>
                <form is="form-player"></form>
            `;
        }
    });
};
