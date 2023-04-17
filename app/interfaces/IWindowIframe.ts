import IVPAIDCreative from './IVPAIDCreative';

interface IWindowIframe extends Window {
    getVPAIDAd: () => IVPAIDCreative;
}

export default IWindowIframe;
