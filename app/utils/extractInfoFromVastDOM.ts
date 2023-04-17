import { ResourceTypeEnum } from 'enums/ResourceTypeEnum';
import { IVastInfo } from 'interfaces/IVastInfo';

const extractInfoFromVastDOM = (vastDOM: Document): IVastInfo => {
    const isJavaScript =
        vastDOM.getElementsByTagName('MediaFile')[0].getAttribute('type') ===
        ResourceTypeEnum.JavaScript;

    const isFrameworkVPAID =
        vastDOM.getElementsByTagName('MediaFile')[0].getAttribute('apiFramework') === 'VPAID';

    const linkMedia = vastDOM.getElementsByTagName('MediaFile')[0].textContent || '';

    return {
        isVPAID: isJavaScript && isFrameworkVPAID,
        mediaLink: linkMedia
    };
};

export default extractInfoFromVastDOM;
