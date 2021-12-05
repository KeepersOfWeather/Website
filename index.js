async function fetchFromApi(endpoint, parameters) {

    // This is our base URL to the API
    url = 'https://keepersofweather.nl/api/';

    // We can add endpoints to our base URL
    if (endpoint) {
        url += endpoint;

        // If that endpoint needs parameters, we can add those as well
        if (parameters) {
            // This will automatically convert an object (json) to 
            // something the API will understand. See: 
            // https://stackoverflow.com/questions/14525178/is-there-any-native-function-to-convert-json-to-url-parameters
            url += '?';
            url += new URLSearchParams(parameters).toString();
        }
    }

    // Fetch our contents from the API
    let response = await fetch(url);
    return await response.json(); // And return it as a JSON object
}

async function listDevices() {
    // This returns devices from https://keepersofweather.nl/api/devices
    return await fetchFromApi("devices");
}

// We need to call an await function, but we're not calling it
// From an async function, so we do this:
// https://stackoverflow.com/questions/39679505/using-await-outside-of-an-async-function

(async () => {

    // Generate tabs based on devices from API

    let devices = await listDevices();

    for (const [deviceID, deviceName] in devices) {
        tabsClass = document.getElementsByClassName("tabs");

        if (tabsClass !== null) {
            tabsClass = tabsClass[0];
        } else {
            console.log("Something is broken when finding tabs div...")
            return;
        }

        // https://www.w3schools.com/jsref/met_node_appendchild.asp
        let newDeviceTab = document.createElement("button");
        let newDeviceTabButton = newDeviceTab.childNodes[0]; // This object has one child
        newDeviceTab.class = "tablinks";
        newDeviceTab.onclick = fetchFromApi("from-device", {"deviceID" : deviceID});
        newDeviceTab.value = deviceName;

        tabsClass.appendChild(newDeviceTab);
    }

})();