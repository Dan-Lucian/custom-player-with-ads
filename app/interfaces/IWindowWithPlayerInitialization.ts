import { IPlayerApi } from 'interfaces/IPlayerApi';

export interface IWindowWithPlayerInitialization extends Window {
    initializePlayer?: (api: IPlayerApi) => void;
}
