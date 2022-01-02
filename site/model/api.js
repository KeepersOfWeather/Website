export async function api_query(endpoint, parameters) {
    // base URL to our API
    let url = 'https://keepersofweather.nl/api/';

    if (endpoint) {
        url += endpoint;

        // If that endpoint needs parameters, we can add those as well
        if (parameters) {
            // This will automatically convert an object (json) to something the API will understand. See: https://stackoverflow.com/questions/14525178/is-there-any-native-function-to-convert-json-to-url-parameters
            url += '?';
            url += new URLSearchParams(parameters).toString();

            console.log("It's funky parameter time, looking for url:")
            console.log(url)
        }
    }

    // Fetch our contents from the API
    let response = await fetch(url);
    return await response.json(); // And return it as a JSON object
}