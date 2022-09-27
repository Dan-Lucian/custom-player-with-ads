/* eslint-disable no-unused-vars */
import IOptionsPlayer from './IOptionsPlayer';

interface IWindowWithPlayerInitialization extends Window {
    initializePlayer?: (options: IOptionsPlayer) => void;
}

export default IWindowWithPlayerInitialization;
