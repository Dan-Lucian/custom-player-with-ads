import html from './utils/html';
import '../css/main.scss';
import './components/PlayerOnboarding';
import './components/FormPlayer';
import video from '../assets/video.mp4';

if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode!');
}

const root = document.getElementById('root');

if (root) {
    root.innerHTML = html`
        <player-onboarding src=${video}></player-onboarding>
        <form is="form-player"></form>
    `;
}
