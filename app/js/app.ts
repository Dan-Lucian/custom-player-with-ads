import '../css/main.scss';
import './components/player-onboarding';

const root = document.getElementById('root');
const Player = document.createElement('player-onboarding');
Player.setAttribute('src', 'https://something.com');

root?.append(Player);
