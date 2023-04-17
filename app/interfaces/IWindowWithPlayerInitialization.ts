import IOptionsPlayer from 'interfaces/IOptionsPlayer';

export interface IWindowWithPlayerInitialization extends Window {
    initializePlayer?: (options: IOptionsPlayer) => void;
}
