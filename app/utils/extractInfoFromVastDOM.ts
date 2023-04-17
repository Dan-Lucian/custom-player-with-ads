import { ResourceTypeEnum } from 'enums/ResourceTypeEnum';
import IInfoVast from 'interfaces/IInfoVast';

const extractInfoFromVastDOM = (vastDOM: Document): IInfoVast => {
    const isJavaScript =
        vastDOM.getElementsByTagName('MediaFile')[0].getAttribute('type') ===
        ResourceTypeEnum.JavaScript;

    const isFrameworkVPAID =
        vastDOM.getElementsByTagName('MediaFile')[0].getAttribute('apiFramework') === 'VPAID';

    const linkMedia = vastDOM.getElementsByTagName('MediaFile')[0].textContent || '';

    return {
        isVPAID: isJavaScript && isFrameworkVPAID,
        linkMedia
    };
};

export default extractInfoFromVastDOM;
