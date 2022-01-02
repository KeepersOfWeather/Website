import { ApiQuery }  from './api.js';
'use strict';

export async function getLatestForLocation(location) {
    let cities = new ApiQuery('locations');

    var newestData = {};
    var fromDeviceId = undefined;

    // https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
    for (const [locationEntry] of Object.entries(cities)) {

        if (locationEntry.City === location) {
            for (const [City, deviceID, deviceNumber] of Object.entries(locationEntry)) {
                var latestFromDevice = await getLatestForDeviceID(deviceNumber);
                
                latestFromDevice = latestFromDevice[0];

                let timestampDate = new Date(latestFromDevice.metadata.utcTimeStamp);

                var latestDate = new Date('1970-01-01T00:00:00');

                if (newestData.metadata !== undefined) {
                    latestDate = new Date(newestData.metadata.utcTimeStamp);
                } 
                
                if (timestampDate > latestDate) {
                    newestData = latestFromDevice;
                    fromDeviceId = id;
                }
            }
        }
    }

    return {fromDeviceId, newestData};
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

export async function updateLatestWeatherDiv(forDeviceID) {
    // Add latest data to latest-data div
    let latestDataDiv = document.getElementsByClassName("latest-data");

    if (latestDataDiv.length !== 0) {
        latestDataDiv = latestDataDiv[0];
        latestDataDiv.innerHTML = "";
    } else {
        console.log("Something is broken when finding tabs div...")
        return;
    }

    // Get latest data from API
    var latestData = {};

    if (forDeviceID !== undefined) {
        latestData = await getLatestForDeviceID(forDeviceID);
    } else {
        latestData = new ApiQuery('latest');
    }

    if (latestData.json.length === 0) {
        console.log("Can't reach API!");
        return;
    }

    // Add from device
    await addToLatestWeather("Device", latestData.json[0].metadata.deviceID);

    // Add latest timestamp
    await addToLatestWeather("Timestamp", latestData.json[0].metadata.utcTimeStamp.replace("T", " ") + " UTC");

    // Add latest temperature
    await addToLatestWeather("Temperature", latestData.json[0].sensorData.temperature + " °C");

    // Check if we are dealing with a py or an lht
    if (latestData.json[0].sensorData.pressure !== null) {
        await addToLatestWeather("Pressure", latestData.json[0].sensorData.pressure + " mBar");
    } else if (latestData.json[0].sensorData.humidity !== null) {
        await addToLatestWeather("Humidity", latestData.json[0].sensorData.humidity + "%");
    }

    // Check if we are dealing with a py or an lht
    if (latestData.json[0].sensorData.lightLux !== null) {
        // We have no lightLogscale, use the lightLux parameter instead
        await addToLatestWeather("Light", latestData.json[0].sensorData.lightLux + " Lux");
    } else if (latestData.json[0].sensorData.lightLogscale !== null) {
        await addToLatestWeather("Light", latestData.json[0].sensorData.lightLogscale + " log");
    }
}