import { IVPAIDCreative } from 'interfaces/IVpaidCreative';

export interface IIframeWindow extends Window {
    getVPAIDAd: () => IVPAIDCreative;
}
