import { api_query }  from './api.js';
'use strict';

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
        latestData = await api_query(`device/${forDeviceID}/latest`);
    } else {
        latestData = await api_query('latest');
    }

    if (latestData.length === 0) {
        console.log("Can't reach API!");
        return;
    }

    // Add from device
    await addToLatestWeather("Device", latestData[0].metadata.deviceID);

    // Add latest timestamp
    await addToLatestWeather("Timestamp", latestData[0].metadata.utcTimeStamp.replace("T", " ") + " UTC");

    // Add latest temperature
    await addToLatestWeather("Temperature", latestData[0].sensorData.temperature + " °C");

    // Check if we are dealing with a py or an lht
    if (latestData[0].sensorData.pressure !== null) {
        await addToLatestWeather("Pressure", latestData[0].sensorData.pressure + " mBar");
    } else if (latestData[0].sensorData.humidity !== null) {
        await addToLatestWeather("Humidity", latestData[0].sensorData.humidity + "%");
    }

    // Check if we are dealing with a py or an lht
    if (latestData[0].sensorData.lightLux !== null) {
        // We have no lightLogscale, use the lightLux parameter instead
        var lightToAdd = (latestData[0].sensorData.lightLux /12415.0)*100.0;
        if (lightToAdd > 100)
        {
            await addToLatestWeather("Light 100 %");
        }
        else
        {
            await addToLatestWeather("Light", lightToAdd + " %");
        }
        
    } else if (latestData[0].sensorData.lightLogscale !== null) {
        var lightToAdd = (latestData[0].sensorData.lightLogscale /217.0)*100.0;
        if (lightToAdd > 100)
        {
            await addToLatestWeather("Light 100 %");
        }
        else
        {
            await addToLatestWeather("Light", lightToAdd + " %");
        }
    }
}