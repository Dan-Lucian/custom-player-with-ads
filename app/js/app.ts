import html from './utils/html';
import '../css/main.scss';
import './components/PlayerOnboarding';
import './components/FormPlayer';
import video from '../assets/video.mp4';

const root = document.getElementById('root');

if (root) {
    root.innerHTML = html`
        <player-onboarding src=${video}></player-onboarding>
        <form is="form-player"></form>
    `;
}
