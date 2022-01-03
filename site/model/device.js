import {api_query} from './api.js';

export async function initDevice(id, startTime, endTime){
    let latest = await api_query(`device/${id}/latest`);
    let location = await api_query(`device/${id}/location`); //TODO:: combine endpoints

    let weather = await api_query(`device/${id}`);

    let temperature, humidity, pressure, light = new Array;
    let timeStamps = new Array;
    for(var i=0; i<await weather.length; i++){
        timeStamps.push(await weather[i].metadata.utcTimeStamp);

        temperature.push(await weather[i].sensorData.temperature);
        humidity.push(await weather[i].sensorData.humidity);
        pressure.push(await weather[i].sensorData.pressure);

        if(await weather[i].sensorData.lightLux === null) this.light.push((await weather[i].sensorData.lightLogscale/ 217.0) * 100.0);
        else light.push((await weather[i].sensorData.lightLux/ 12415.0) * 100.0);
    } 

    let device = {
        id : id,
        name : await latest[0].metadata.deviceID,
        lastRecieved : await latest[0].metadata.utcTimeStamp,
        connection : await latest[0].metadata.snr,
        location : await location[0][0],
        timeStamps : timeStamps, 
        temperature : temperature, 
        humidity : humidity, 
        pressure : pressure, 
        light : light
    };

    return device;
}


// export class Device{
//     constructor(id, startTime, endTime){
//         this.id = id;

//         let latest = api_query(`device/${id}/latest`);
//         let location = api_query(`device/${id}/location`); //TODO:: combine endpoints
        
//         this.name = latest.json[0].metadata.deviceID;;
//         this.lastRecieved = latest.json[0].metadata.utcTimeStamp;
//         this.connection = latest.json[0].metadata.snr;
//         this.location = location.json[0][0];
        
//         let weather = api_query(`device/${id}`);

//         this.timeStamps, this.temperature, this.humidity, this.pressure, this.light = new Array;
//         for(var i=0; i<weather.json.length; i++){
//             this.timeStamps.push(weather.json[i].metadata.utcTimeStamp);

//             this.temperature.push(weather.json[i].sensorData.temperature);
//             this.humidity.push(weather.json[i].sensorData.humidity);
//             this.pressure.push(weather.json[i].sensorData.pressure);

//             if(weather.json[i].sensorData.lightLux === null) this.light.push((weather.json[i].sensorData.lightLogscale/ 217.0) * 100.0);
//             else this.light.push((weather.json[i].sensorData.lightLux/ 12415.0) * 100.0);
//         } 
//     }
// }

