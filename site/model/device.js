import {api_query} from './api.js';

export async function initDevice(id, startTime, endTime){
    let latest = await api_query(`device/${id}/latest`);
    let location = await api_query(`device/${id}/location`); //TODO:: combine endpoints

    if(startTime) {
        if(endTime) let weather = await api_query(`initDevice/${id}`,'since',startTime,'till',endTime);
        else let weather = await api_query(`initDevice/${id}`,'since',startTime);
    }
    else let weather = await api_query(`initDevice/${id}`);
    
    let timeStamps = new Array;
    let temperature = new Array;
    let humidity = new Array;
    let pressure = new Array;
    let light = new Array;
    for(var i=0; i<await weather.length; i++){
        timeStamps.push(await UTCtoDate(weather[i].metadata.utcTimeStamp));

        temperature.push(await weather[i].sensorData.temperature);
        humidity.push(await weather[i].sensorData.humidity);
        pressure.push(await weather[i].sensorData.pressure);

        if(await weather[i].sensorData.lightLux === null) light.push((await weather[i].sensorData.lightLogscale/ 217.0) * 100.0);
        else light.push((await weather[i].sensorData.lightLux/ 12415.0) * 100.0);
    } 

    let device = {
        id : id,
        name : await latest[0].metadata.deviceID,
        lastRecieved : await latest[0].metadata.utcTimeStamp,
        connection : await latest[0].transmissionalData.rssi,
        location :  Object.entries(await location)[0][1],
        timeStamps : timeStamps, 
        temperature : temperature, 
        humidity : humidity, 
        pressure : pressure, 
        light : light
    };

    console.log('Device created: ');
    console.log(device.id);
    console.log(device.name);
    console.log(device.lastRecieved);
    console.log(device.connection);
    console.log(device.location);
    console.log(device.timeStamps);
    console.log(device.temperature);
    console.log(device.humidity);
    console.log(device.pressure);
    console.log(device.light);
    console.log();

    return device;
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
