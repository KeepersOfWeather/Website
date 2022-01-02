import { ApiQuery }  from './api.js';
import { updateLatestWeatherDiv, getLatestForLocation }  from './latestWeather.js';
'use strict';

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

/// This function will fill up the devices list with devices passed as id: device in deviceCollection
/// param deviceCollection: dictionary
async function createDeviceList(devicesCollection) {
    
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
        let devicesDiv = document.getElementsByClassName("devices");

        let newDeviceButton = document.createElement("button");
        
        newDeviceButton.classList.add("devices"); 
        newDeviceButton.id = cityName;

        newDeviceButton.onclick = async function () { 
            removeActiveFromButtons();
            newDeviceButton.classList.add("active");
            get
            createGraphs();
        };

        newDeviceButton.innerHTML = cityName; // rename the button
        
        devicesDiv.appendChild(newCityButton);
    }
    
}

export async function createNavBar() {
    // Begin by asking API for all devices sorted by location
    // Generate tabs dynamically: https://www.w3schools.com/howto/howto_js_tabs.asp
    let cities = new ApiQuery('locations');

    // Grab cities Div from index.html
    let citiesDiv = document.getElementsByClassName("cities");

    if (citiesDiv.length !== 0) {
        citiesDiv = citiesDiv[0];
    } else {
        console.log("Something is broken when finding tabs div...")
        return;
    }

    let allButton = document.createElement("button");
        
    allButton.classList.add("All");
    // allButton.classList.add("active");
    allButton.id = "All";

    let allDevices = new ApiQuery('devices');

    allButton.onclick = async function () {
        removeActiveFromButtons();
        allButton.classList.add("active");
        createDeviceList(allDevices.json);
        await updateLatestWeatherDiv();
    };

    allButton.innerHTML = "All"; // Change the name to be the city name

    citiesDiv.appendChild(allButton);

    // Iterate through each location stored cities
    // https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
    for (const [cityName, deviceList] of Object.entries(cities.json)) {

        // Generate a button for each availiable location recieved from the API 
        // https://www.w3schools.com/jsref/met_node_appendchild.asp

        let newCityButton = document.createElement("button");
        
        newCityButton.classList.add("city"); 
        newCityButton.id = cityName;

        // When 
        newCityButton.onclick = async function () { 
            removeActiveFromButtons();
            newCityButton.classList.add("active");
            createDeviceList(deviceList);
            let latestDataFromLocation = await getLatestForLocation(deviceList);
            await updateLatestWeatherDiv(latestDataFromLocation.fromDeviceId);
        };

        newCityButton.innerHTML = cityName; // rename the button
        
        citiesDiv.appendChild(newCityButton);
    }

    allButton.classList.add("active");
    createDeviceList(allDevices.json);
    await updateLatestWeatherDiv();
}