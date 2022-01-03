import {api_query} from './api.js';

export async function initDevice(id, startTime, endTime){
    let latest = await api_query(`device/${id}/latest`);
    let location = await api_query(`device/${id}/location`); //TODO:: combine endpoints

    let weather = await api_query(`device/${id}`);
    
    let timeStamps = new Array;
    let temperature = new Array;
    let humidity = new Array;
    let pressure = new Array;
    let light = new Array;
    for(var i=0; i<await weather.length; i++){
        timeStamps.push(await weather[i].metadata.utcTimeStamp);

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
        connection : await latest[0].transmissionalData.snr,
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

