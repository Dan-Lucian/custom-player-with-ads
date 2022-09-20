class ServiceAd {
    private URL_API = 'http://rtr.innovid.com/r1.57ebf098e82109.85834506;cb=__CB__';

    public async requestAd(): Promise<string> {
        const response = await fetch(this.URL_API, {
            method: 'GET'
        });

        const responseDecoded = await response.text();

        if (!response.ok) throw new Error(responseDecoded);

        return responseDecoded;
    }
}

export default ServiceAd;
