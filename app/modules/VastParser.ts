import { ResourceTypeEnum } from 'enums/ResourceTypeEnum';
import { IVastInfo } from 'interfaces/IVastInfo';

export class VastParser {
    /**
     * Extracts essential values from a vast dom.
     * @param {Document} vastDOM vast dom.
     * @returns {IVastInfo} IVastInfo.
     */
    public static parseVastDom(vastDOM: Document): IVastInfo {
        const isJavaScript =
            vastDOM.getElementsByTagName('MediaFile')[0].getAttribute('type') ===
            ResourceTypeEnum.JavaScript;

        const isVPAID =
            vastDOM.getElementsByTagName('MediaFile')[0].getAttribute('apiFramework') === 'VPAID';

        const mediaLink = vastDOM.getElementsByTagName('MediaFile')[0].textContent || '';

        return {
            isVPAID: isJavaScript && isVPAID,
            mediaLink
        };
    }
}
