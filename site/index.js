'use strict';

async function fetchFromApi(endpoint, parameters) {

    // This is our base URL to the API
    let url = 'https://keepersofweather.nl/api/';

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

            console.log("Oh crap it's funky parameter time, url is:")
            console.log(url)
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

async function fromDevice(deviceID) {
    return await fetchFromApi(`device/${deviceID}`);
}

// We need to call an async function, but we're not calling it
// From inside of an async function, so we do this hack:
// https://stackoverflow.com/questions/39679505/using-await-outside-of-an-async-function

(async () => {

    // Generate tabs based on devices from API
    // Info here: https://www.w3schools.com/howto/howto_js_tabs.asp

    let devices = await listDevices();

    // https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
    for (const [deviceID, deviceName] of Object.entries(devices)) {
        let tabsClass = document.getElementsByClassName("tabs");

        if (tabsClass.length !== 0) {
            tabsClass = tabsClass[0];
        } else {
            console.log("Something is broken when finding tabs div...")
            return;
        }
    

        // https://www.w3schools.com/jsref/met_node_appendchild.asp
        let newDeviceTab = document.createElement("button");
        // let newDeviceTabButton = newDeviceTab.childNodes[0]; // This object has one child
        newDeviceTab.classList.add("tablinks");
        newDeviceTab.id = deviceName;
        newDeviceTab.onclick = async function () { console.log(fromDevicedeviceID) };
        newDeviceTab.innerHTML = deviceName;

        tabsClass.appendChild(newDeviceTab);
    }

})();
