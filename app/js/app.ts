import '../css/main.scss';
import './components/PlayerOnboarding';
import './components/FormPlayer';
import html from './utils/html';

const root = document.getElementById('root');

if (root) {
    root.innerHTML = `
        <player-onboarding src="/assets/video.mp4"></player-onboarding>
        <form is="form-player"></form>
    `;
}
