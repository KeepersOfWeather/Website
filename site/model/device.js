import {ApiQuery} from './api';

class Device{
    constructor(id, startTime, endTime){
        this.id = id;

        let latest = new ApiQuery(`device/${id}/latest`);
        let location = new ApiQuery(`device/${id}/location`); //TODO:: combine endpoints
        
        this.name = latest.json[0].metadata.deviceID;;
        this.lastRecieved = latest.json[0].metadata.utcTimeStamp;
        this.connection = latest.json[0].metadata.snr;
        this.location = location.json[0][0];
        

        if(endTime && startTime) let weather = new ApiQuery(`device/${id}`); //TODO:: only return sensor data
        else if(!endTime) let weather = new ApiQuery(`device/${id}`);
        else let weather = new ApiQuery(`device/${id}`);

        this.timeStamps, this.temperature, this.humidity, this.pressure, this.light = new Array;
        for(var i=0; i<weather.json.length; i++){
            this.timeStamps.push(weather.json[i].metadata.utcTimeStamp);

            this.temperature.push(weather.json[i].sensorData.temperature);
            this.humidity.push(weather.json[i].sensorData.humidity);
            this.pressure.push(weather.json[i].sensorData.pressure);

            if(weather.json[i].sensorData.lightLux === null) this.light.push((weather.json[i].sensorData.lightLogscale/ 217.0) * 100.0);
            else this.light.push((weather.json[i].sensorData.lightLux/ 12415.0) * 100.0);
        } 
    }
}

