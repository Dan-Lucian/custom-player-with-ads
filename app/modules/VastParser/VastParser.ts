import { ResourceTypeEnum } from 'enums/ResourceTypeEnum';
import { IParsedVast } from 'interfaces/IParsedVast';

export class VastParser {
    private domParser;

    constructor() {
        this.domParser = new DOMParser();
    }

    /**
     * Extracts essential values from a vast xml.
     * @param {Document} vast vast xml.
     * @returns {IParsedVast} IVastInfo.
     */
    public parseString(vast: string): IParsedVast {
        const vastDOM = this.domParser.parseFromString(vast, 'text/xml');
        const isJavaScript =
            vastDOM.getElementsByTagName('MediaFile')[0].getAttribute('type') ===
            ResourceTypeEnum.JavaScript;

        const isVPAID =
            vastDOM.getElementsByTagName('MediaFile')[0].getAttribute('apiFramework') === 'VPAID';

        const mediaLink = vastDOM.getElementsByTagName('MediaFile')[0].textContent || '';

        return {
            isVPAID: isJavaScript && isVPAID,
            mediaLink,
            isIMAUrl: false
        };
    }
}
