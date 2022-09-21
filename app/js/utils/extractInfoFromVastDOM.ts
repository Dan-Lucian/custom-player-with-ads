import EnumTypeResource from '../enums/EnumTypeResource';
import IInfoVast from '../interfaces/IInfoVast';

const extractInfoFromVastDOM = (vastDOM: Document): IInfoVast => {
    const isVPAID =
        vastDOM.getElementsByTagName('MediaFile')[0].getAttribute('type') ===
        EnumTypeResource.JavaScript;

    const linkMedia = vastDOM.getElementsByTagName('MediaFile')[0].textContent || '';

    return {
        isVPAID,
        linkMedia
    };
};

export default extractInfoFromVastDOM;
