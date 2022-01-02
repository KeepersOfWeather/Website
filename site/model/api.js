class Api {
    constructor(endpoint, parameters){
        // base URL to our API
        let url = 'https://keepersofweather.nl/api/';

        if (endpoint) {
            url += endpoint;

            if (parameters) {
                // this will automatically convert an object (json) to something the API will understand. See: https://stackoverflow.com/questions/14525178/is-there-any-native-function-to-convert-json-to-url-parameters
                url += '?';
                url += new URLSearchParams(parameters).toString();

                console.log("It's funky parameter time, looking for url: ");
                console.log(url);
            }
        }
        // await and store api contents
        response = fetch(url);
        this.json =  await response.json(); // keep a json object handy
    }
}
