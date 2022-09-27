import IWindowWithPlayerInitialization from './interfaces/IWindowWithPlayerInitialization';

const windowWithPlayerInitialization: IWindowWithPlayerInitialization = window;

if (windowWithPlayerInitialization.initializePlayer) {
    windowWithPlayerInitialization.initializePlayer();
}
