import random from 'utils/random';

export class AdService {
    private links = [
        'http://rtr.innovid.com/r1.57ebf098e82109.85834506;cb=__CB__',
        'https://assets.connatix.com/Elements/29cf9ad9-2fab-4ace-a5c8-d37d0242f38d/VastAdTag.xml',
        'https://pubads.g.doubleclick.net/gampad/ads?' +
            'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
            'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
            'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator='
    ];
    private URL = '';

    public async requestAd(): Promise<string> {
        this.URL = random(...this.links) as string;

        const response = await this.requestAdByCurrentUrl();
        return response;
    }

    public async requestAdByCurrentUrl(): Promise<string> {
        const response = await fetch(this.URL, {
            method: 'GET'
        });

        const responseDecoded = await response.text();

        if (!response.ok) throw new Error(responseDecoded);

        return responseDecoded;
    }

    public getRandomLink(): string {
        return random(...this.links) as string;
    }
}
