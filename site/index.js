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

async function getDevices() {
    // This returns devices from https://keepersofweather.nl/api/devices
    return await fetchFromApi("devices");
}

async function fromDevice(deviceID) {
    // This returns devices from https://keepersofweather.nl/api/devices
    return await fetchFromApi(`device/${deviceID}`);
}

async function getLocations() {
    return await fetchFromApi("locations")
}

async function showDevices(devicesCollection) {
    let devicesList = document.getElementsByClassName("devices");

    if (devicesList.length !== 0) {
        devicesList = devicesList[0];
    } else {
        console.log("Something is broken when finding devices ul...")
        return;
    }

    // Clear list of devices
    devicesList.innerHTML = ""

    for (const [deviceId, deviceName] of Object.entries(devicesCollection)) {

        let newDeviceEntry = document.createElement("div");

            let newDeviceCheckBox = document.createElement("input");
            newDeviceCheckBox.type = "checkbox"
            newDeviceCheckBox.id = deviceName
            newDeviceCheckBox.name = deviceName

            let newDeviceLabel = document.createElement("label");
            newDeviceLabel.htmlFor = deviceName

        newDeviceEntry.appendChild(newDeviceCheckBox);
        newDeviceEntry.appendChild(newDeviceLabel);

        devicesList.appendChild(newDeviceEntry);
    }
}

// We need to call an async function, but we're not calling it
// From inside of an async function, so we do this hack:
// https://stackoverflow.com/questions/39679505/using-await-outside-of-an-async-function

(async () => {

    // Generate tabs based on devices from API
    // Info here: https://www.w3schools.com/howto/howto_js_tabs.asp

    let cities = await getLocations();

    let citiesClass = document.getElementsByClassName("cities");

    if (citiesClass.length !== 0) {
        citiesClass = citiesClass[0];
    } else {
        console.log("Something is broken when finding tabs div...")
        return;
    }

    // https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
    for (const [city, deviceCollection] of Object.entries(cities)) {
        
        // https://www.w3schools.com/jsref/met_node_appendchild.asp
        let newCityTab = document.createElement("button");
        
        newCityTab.classList.add("city");
        newCityTab.id = city;

        newCityTab.onclick = async function () { showDevices(deviceCollection) };
        newCityTab.innerHTML = city; // Change the name to be the city name

        citiesClass.appendChild(newCityTab);
    }

    let allButton = document.createElement("button");
        
    allButton.classList.add("all");
    allButton.id = "all";

    let allDevices = await getDevices();

    allButton.onclick = async function () { showDevices(allDevices) };
    allButton.innerHTML = "All"; // Change the name to be the city name

    citiesClass.appendChild(allButton);
})();
