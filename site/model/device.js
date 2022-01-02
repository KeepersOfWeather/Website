class Device{
    constructor(id, startTime, endTime){
        this.id = id;

        let latest = new Api(`device/${id}/latest`);
        let location = new Api(`device/${id}/location`); //TODO:: combine endpoints
        
        this.name = await latest.json[0].metadata.deviceID;;
        this.lastRecieved = await latest.json[0].metadata.utcTimeStamp;
        this.connection = await latest.json[0].metadata.snr;
        this.location = await location.json[0][0];
        

        if(endTime && startTime) let weather = new Api(`device/${id}`); //TODO:: only return sensor data
        else if(!endTime) let weather = new Api(`device/${id}`);
        else let weather = new Api(`device/${id}`);

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

