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
    return await fetchFromApi("locations");
}

async function getLatest() {
    return await fetchFromApi("latest");
}

async function getLatestForDeviceID(id) {
    return await fetchFromApi(`device/${id}/latest`);
}

async function showDevices(devicesCollection) {
    // This function will fill up the devices list with devices passed
    // as id: device in deviceCollection
    /// param deviceCollection: dictionary
    let devicesList = document.getElementsByClassName("devices");

    if (devicesList.length !== 0) {
        devicesList = devicesList[0];
    } else {
        console.log("Something is broken when finding devices ul...")
        return;
    }

    // Clear list of devices
    devicesList.innerHTML = ""

    // Go over each id and name in the passed dictionary
    for (const [deviceId, deviceName] of Object.entries(devicesCollection)) {

        // Create a div with a check box and a label
        let newDeviceEntry = document.createElement("div");

            let newDeviceCheckBox = document.createElement("input");
            newDeviceCheckBox.type = "checkbox";
            newDeviceCheckBox.id = deviceName;
            newDeviceCheckBox.name = deviceName;

            let newDeviceLabel = document.createElement("label");
            newDeviceLabel.htmlFor = deviceName;
            newDeviceLabel.innerHTML = deviceName;

        // Add the checkbox and label for the checkbox
        // To the div for the new entry
        newDeviceEntry.appendChild(newDeviceCheckBox);
        newDeviceEntry.appendChild(newDeviceLabel);

        // Add the new entry to our list of devices
        devicesList.appendChild(newDeviceEntry);
    }
}

function removeActiveFromButtons() {
    let citiesClass = document.getElementsByClassName("cities");

    if (citiesClass.length === 0)  {
        console.log("Something is broken when finding tabs div...")
        return;
    }

    let buttonList = citiesClass[0].childNodes;

    for (var i = 0; i < buttonList.length; i++) {
        buttonList[i].classList.remove("active");
    }
}

async function addToLatestWeather(name, value) {
    // Add latest data to latest-data div
    let latestDataDiv = document.getElementsByClassName("latest-data");

    if (latestDataDiv.length !== 0) {
        latestDataDiv = latestDataDiv[0];
    } else {
        console.log("Something is broken when finding tabs div...")
        return;
    }

    // Generate a new table entry for the latest weather table
    let newTr = document.createElement("tr");

    let nameTh = document.createElement("th");
    nameTh.innerHTML = name;

    let valueTh = document.createElement("th");
    valueTh.innerHTML = value;

    newTr.appendChild(nameTh);
    newTr.appendChild(valueTh);

    latestDataDiv.appendChild(newTr);
}

async function updateLatestWeatherDiv(forDeviceID) {
    // Add latest data to latest-data div
    let latestDataDiv = document.getElementsByClassName("latest-data");

    if (latestDataDiv.length !== 0) {
        latestDataDiv = latestDataDiv[0];
    } else {
        console.log("Something is broken when finding tabs div...")
        return;
    }

    // Get latest data from API

    let latestData = await getLatestForDeviceID(forDeviceID);

    if (!latestData) {
        console.log("Can't reach API!");
        return;
    }

    // Add from device
    await addToLatestWeather("Device", latestData[0].metadata.deviceID);

    // Add latest timestamp
    await addToLatestWeather("Timestamp", latestData[0].metadata.utcTimeStamp.replace("T", " ") + " UTC");

    // Add latest temperature
    await addToLatestWeather("Temperature", latestData[0].sensorData.temperature + " °C");

    if (latestData[0].sensorData.humidity !== null) {
        await addToLatestWeather(Humidity, latestData[0].sensorData.humidity + "%");
    } else {
        await addToLatestWeather("Pressure", latestData[0].sensorData.pressure + " mBar");
    }

    if (latestData[0].sensorData.lightLogscale === null) {
        // We have no lightLogscale, use the lightLux parameter instead
        await addToLatestWeather("Light", latestData[0].sensorData.lightLux + " Lux");

    } else {
        await addToLatestWeather("Light", latestData[0].sensorData.lightLogscale + " log");
    }
}

async function getLatestForLocation(location) {
    let cities = await getLocations();

    var latestData = {};
    var fromDeviceId = undefined;

    // https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
    for (const [city, deviceCollection] of Object.entries(cities)) {

        if (city === location) {
            for (const [id, device] of Object.entries(deviceCollection)) {
                var latestFromDevice = await getLatestForDeviceID(id);
                
                latestFromDevice = latestFromDevice[0];

                let timestampDate = new Date(latestFromDevice.metadata.utcTimeStamp);

                var latestDate = new Date('1970-01-01T00:00:00');

                if (latestFromDevice) {
                    latestDate = new Date(latestFromDevice.metadata.utcTimeStamp);
                } 
                
                if (timestampDate > latestDate) {
                    latestData = latestFromDevice;
                    fromDeviceId = id;
                }
            }
        }
    }

    return latestData;
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
        let newCityButton = document.createElement("button");
        
        newCityButton.classList.add("city");
        newCityButton.id = city;

        newCityButton.onclick = async function () { 
            removeActiveFromButtons();
            newCityButton.classList.add("active");
            showDevices(deviceCollection);
        };

        newCityButton.innerHTML = city; // Change the name to be the city name
        
        citiesClass.appendChild(newCityButton);

        if (city === "Wierden") {
            removeActiveFromButtons();
            newCityButton.classList.add("active");
            showDevices(deviceCollection)
        }
    }

    let allButton = document.createElement("button");
        
    allButton.classList.add("All");
    // allButton.classList.add("active");
    allButton.id = "All";

    let allDevices = await getDevices();

    allButton.onclick = async function () {
        removeActiveFromButtons();
        allButton.classList.add("active");
        showDevices(allDevices)
    };

    allButton.innerHTML = "All"; // Change the name to be the city name

    citiesClass.appendChild(allButton);

    // Update latest weather stuff
    // await updateLatestWeatherDiv();
})();
