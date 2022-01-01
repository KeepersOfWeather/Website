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

function UTCtoDate(dateStr) {
    // 2021-12-14T12:37:44
    
    dateStr = dateStr.split("T");
    const dateParts = dateStr[0].split("-");
    // console.log(dateParts);

    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    const timeParts = dateStr[1].split(":");
    // console.log(timeParts);
    const hours = timeParts[0];
    const minutes = timeParts[1];
    const seconds = timeParts[2];

    // For some reason it appends one to the year when making a UTC date, so subtract one
    return new Date(Date.UTC(year - 1, month, day, hours, minutes, seconds)).toLocaleString();    
}


async function fetchTimestampsFromWeatherpoints(weatherPoints) {
    var timestamps = new Array;
    
    for (var i = 0; i < weatherPoints.length; i++) {
        // console.log(weatherPoints[i].metadata.utcTimeStamp + " UTC");

        let parsedTimestamp = UTCtoDate(weatherPoints[i].metadata.utcTimeStamp);

        timestamps.push(parsedTimestamp);
    }

    return timestamps;
}

async function fetchTemperateFromWeatherpoints(weatherPoints) {
    var temperatures = new Array;
    
    for (var i = 0; i < weatherPoints.length; i++) {
        temperatures.push(weatherPoints[i].sensorData.temperature);
    }

    return temperatures;
}

async function fetchPressureFromWeatherpoints(weatherPoints) {
    var pressure = new Array;
    
    for (var i = 0; i < weatherPoints.length; i++) {
        pressure.push(weatherPoints[i].sensorData.pressure);
    }

    return pressure;
}

async function fetchHumidityFromWeatherpoints(weatherPoints) {
    var hum = new Array;
    
    for (var i = 0; i < weatherPoints.length; i++) {
        hum.push(weatherPoints[i].sensorData.humidity);
    }

    return hum;
}

function lightToPercentage(logOrLux, type) {
    if (type === "lux") {
        // Highest lux value in database
        return (logOrLux / 12415.0) * 100.0;
    } else if (type === "log" ) {
        // Highest log value in database
        return (logOrLux / 217.0) * 100.0;
    }
}

async function fetchLightLuxFromWeatherpoints(weatherPoints) {
    var light = new Array;
    
    for (var i = 0; i < weatherPoints.length; i++) {
        light.push((weatherPoints[i].sensorData.lightLux/ 12415.0) * 100.0);
    }

    //const lightPercentage = await lightToPercentage(light, "lux");
    return light;
}

async function fetchLightLogFromWeatherpoints(weatherPoints) {
    var light = new Array;
    
    for (var i = 0; i < weatherPoints.length; i++) {
        light.push((weatherPoints[i].sensorData.lightLogscale/ 217.0) * 100.0);
    }

    //const lightPercentage = await lightToPercentage(light, "log");
    return light;
}

async function generateDataset(name, data) {
    // TODO:: implement like fetchTemperateFromWeatherpoints(weatherPoints)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function showDataForDevice(deviceID) {

    console.log(`showDataForDevice called with ${deviceID}`)

    // Get data from API for device id
    let weatherPoints = await fromDevice(deviceID);

    if (weatherPoints.length === 0) {
        console.log(`API returned empty array for await fromDevice(${deviceID})`);
        return;
    }

    const timestamps = await fetchTimestampsFromWeatherpoints(weatherPoints);
    const temperatures = await fetchTemperateFromWeatherpoints(weatherPoints);

    const ctx = document.getElementById('tempDataChart');
    const ctx1 = document.getElementById('humDataChart');
    const ctx2 = document.getElementById('lightDataChart');

    // var datasets = [];

    // Check if we are dealing with a py or an lht
    if (weatherPoints[0].sensorData.humidity === null) {
        const pressure = await fetchPressureFromWeatherpoints(weatherPoints);
        const _ = new Chart(ctx1, {
            type: 'line',
            data : {
                labels: timestamps,
                datasets: [{
                    label: 'Pressure',
                    data: pressure,
                    borderColor: 'rgb(255, 99, 132)'
                }]
            }
        });

        //await generateDataset("Pressure", weatherPoints[0].sensorData.pressure);
    } else {
        const hum = await fetchHumidityFromWeatherpoints(weatherPoints);
        const _ = new Chart(ctx1, {
            type: 'line',
            data : {
                labels: timestamps,
                datasets: [{
                    label: 'Humidity %',
                    data: hum,
                    borderColor: 'rgb(255, 99, 132)'
                }]
            }
        });

        //await generateDataset("Humidity %", weatherPoints[0].sensorData.humidity);
    }

    // Check if we are dealing with a py or an lht
    if (weatherPoints[0].sensorData.lightLux !== null) {
        const light = await fetchLightLuxFromWeatherpoints(weatherPoints);
        const _ = new Chart(ctx2, {
            type: 'line',
            data : {
                labels: timestamps,
                datasets: [{
                    label: 'Light %',
                    data: light,
                    borderColor: 'rgb(255, 99, 132)'
                }]
            }
        });

        // const lightPercentage = await lightToPercentage(weatherPoints[0].sensorData.lightLux, "lux");
        // const dataset = await generateDataset("Light %", lightPercentage);
        //datasets.push(dataset);
    } else if (weatherPoints[0].sensorData.lightLogscale !== null) {
        const light = await fetchLightLogFromWeatherpoints(weatherPoints);
        const _ = new Chart(ctx2, {
            type: 'line',
            data : {
                labels: timestamps,
                datasets: [{
                    label: 'Light %',
                    data: light,
                    borderColor: 'rgb(255, 99, 132)'
                }]
            }
        });
        // const lightPercentage = await lightToPercentage(weatherPoints[0].sensorData.lightLogscale, "log");
        // await generateDataset("Light %", lightPercentage);
    }

    console.log("All stuff is awaited!");

    console.log("Time to show graphs!");

    displayGraph('Temperatures', temperatures, timestamps, ctx);

    // const _ = new Chart(ctx, {
    //     type: 'line',
    //     data : {
    //         labels: timestamps,
    //         datasets: [
    //             {
    //             label: 'Temperatures',
    //             data: temperatures,
    //             borderColor: 'rgb(255, 99, 132)'
    //         }
    //         // ,{
    //         //     label: 'Humidity',
    //         //     data: hum,
    //         //     borderColor: 'rgb(255, 99, 132)'
    //         // }
    //     ]
    //     }
    // });
}

async function displayGraph(title, data, timestamps, ctx) {
    const _ = new Chart(ctx, {
            type: 'line',
            data : {
                labels: timestamps,
                datasets: [
                    {
                    label: title,
                    data: data,
                    borderColor: 'rgb(255, 99, 132)'
                }
            ]
            }
        });
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
        latestData = await getLatest();
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
        await addToLatestWeather("Light", latestData[0].sensorData.lightLux + " Lux");
    } else if (latestData[0].sensorData.lightLogscale !== null) {
        await addToLatestWeather("Light", latestData[0].sensorData.lightLogscale + " log");
    }
}

async function getLatestForLocation(location) {
    let cities = await getLocations();

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

// We need to call an async function, but we're not calling it
// From inside of an async function, so we do this hack:
// https://stackoverflow.com/questions/39679505/using-await-outside-of-an-async-function

(async () => {
    // Begin by asking API for all devices sorted by location
    // Generate tabs dynamically: https://www.w3schools.com/howto/howto_js_tabs.asp
    let cities = await getLocations();

    // Grab cities Div from index.html
    let citiesDiv = document.getElementsByClassName("cities");

    if (citiesDiv.length !== 0) {
        citiesDiv = citiesDiv[0];
    } else {
        console.log("Something is broken when finding tabs div...")
        return;
    }

    // Iterate through each location stored cities
    // https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
    for (const [cityName, deviceList] of Object.entries(cities)) {

        // Generate a button for each availiable location recieved from the API 
        // https://www.w3schools.com/jsref/met_node_appendchild.asp

        let newCityButton = document.createElement("button");
        
        newCityButton.classList.add("city"); 
        newCityButton.id = cityName;

        // When 
        newCityButton.onclick = async function () { 
            removeActiveFromButtons();
            newCityButton.classList.add("active");
            showDevices(deviceList);
            let latestDataFromLocation = await getLatestForLocation(deviceList);
            await updateLatestWeatherDiv(latestDataFromLocation.fromDeviceId);
        };

        newCityButton.innerHTML = cityName; // rename the button
        
        citiesDiv.appendChild(newCityButton);
    }

    let allButton = document.createElement("button");
        
    allButton.classList.add("All");
    // allButton.classList.add("active");
    allButton.id = "All";

    let allDevices = await getDevices();

    allButton.onclick = async function () {
        removeActiveFromButtons();
        allButton.classList.add("active");
        showDevices(allDevices);
        await updateLatestWeatherDiv();
    };

    allButton.innerHTML = "All"; // Change the name to be the city name

    citiesDiv.appendChild(allButton);

    // var el = document.getElementById('div');
    // var dev = div.getElementsByTagName('input');
    // var length = dev.length;

    // for(var i=0; i<length; i++){
    //     if(dev[i].type === 'checkbox'){
    //         dev[i].onclick = await showDataForDevice()
    //     }
    // }

    if(document.getElementById("devices").getElementsByClassName("div") == null) console.log('EMPTY');
    else console.log(document.getElementById("devices").getElementsByClassName("div").length);

    await showDataForDevice(0);
})();
