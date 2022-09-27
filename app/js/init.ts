import srcVideoBunny from '../assets/bunny.mp4';
import srcVideoStronger from '../assets/stronger.mp4';
import srcVideoRainingMen from '../assets/raining-men.mp4';
import IWindowWithPlayerInitialization from './interfaces/IWindowWithPlayerInitialization';

const windowWithPlayerInitialization: IWindowWithPlayerInitialization = window;

if (windowWithPlayerInitialization.initializePlayer) {
    windowWithPlayerInitialization.initializePlayer({
        selector: '#root',
        playlist: [srcVideoBunny, srcVideoStronger, srcVideoRainingMen]
    });
}
