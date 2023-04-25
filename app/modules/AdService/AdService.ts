import { IMA_AD_URL, VIDEO_AD_URL, VPAID_AD_URL } from 'mocks/adUrls';
import { getRandomValueFromArray } from 'utils/generalUtils';

// TODO: move to sepparate module
export class AdService {
    private adUrls = [VPAID_AD_URL, VIDEO_AD_URL, IMA_AD_URL];

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
