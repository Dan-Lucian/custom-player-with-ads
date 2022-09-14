import '../css/main.scss';
import './components/player-onboarding';

const root = document.getElementById('root');
const Player = document.createElement('player-onboarding');
Player.setAttribute('src', '/assets/video.mp4');

root?.append(Player);
