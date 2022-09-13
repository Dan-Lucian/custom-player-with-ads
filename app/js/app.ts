import '../css/main.scss';
import './components/player-onboarding';

const root = document.getElementById('root');
const Player = document.createElement('player-onboarding');
Player.setAttribute('href', 'https://something.com');

setTimeout(() => Player.setAttribute('href', 'https://juked.com'), 1000);

root?.append(Player);
