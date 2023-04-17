import { getRandomValueFromArray } from 'utils/generalUtils';

export class AdService {
    private adUrls = [
        'http://rtr.innovid.com/r1.57ebf098e82109.85834506;cb=__CB__',
        'https://assets.connatix.com/Elements/29cf9ad9-2fab-4ace-a5c8-d37d0242f38d/VastAdTag.xml',
        'https://pubads.g.doubleclick.net/gampad/ads?' +
            'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
            'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
            'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator='
    ];

    public async requestAd(): Promise<string> {
        const url = getRandomValueFromArray(this.adUrls);

        const response = await AdService.requestAdByUrl(url);
        return response;
    }

    public static async requestAdByUrl(url: string): Promise<string> {
        const response = await fetch(url, {
            method: 'GET'
        });

        const decodedResponse = await response.text();

        if (!response.ok) {
            throw new Error(decodedResponse);
        }

        return decodedResponse;
    }

    public getRandomAdUrl(): string {
        return getRandomValueFromArray(this.adUrls);
    }
}
