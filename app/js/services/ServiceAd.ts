import random from '../utils/random';

class ServiceAd {
    private links = [
        'http://rtr.innovid.com/r1.57ebf098e82109.85834506;cb=__CB__',
        'https://assets.connatix.com/Elements/29cf9ad9-2fab-4ace-a5c8-d37d0242f38d/VastAdTag.xml'
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
}

export default ServiceAd;
