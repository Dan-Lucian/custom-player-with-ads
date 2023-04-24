import { IVpaidCreative } from 'modules/VpaidWrapper/interfaces/IVpaidCreative';

export interface IVpaidWindow extends Window {
    getVPAIDAd: () => IVpaidCreative;
}
