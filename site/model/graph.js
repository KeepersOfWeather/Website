import { initDevice }  from './device.js';
'use strict';

async function fillGraph(title, data, timestamps, ctx) {
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

// dont graph anything if return -1
async function checkInput() {
    let devices = document.getElementById(devices);
    if (devices === null) return -1;

    let id = 0;
    for(const [input,lable] of Object.entries(devices)){
        const box = document.getElementById(lable);
        const checked = box.checked;
        if(checked) return id;
        id++;
    }
    return -1;
}

export async function createGraphs(id) {
    var tempCanvas = document.getElementById('tempDataChart');
    var humCanvas = document.getElementById('humDataChart');
    var lightCanvas = document.getElementById('lightDataChart');

    if(tempContext){
        var tempContext = tempCanvas.getContext('2d');
        var humContext = humCanvas.getContext('2d');
        var lightContext = lightCanvas.getContext('2d');

        tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        humContext.clearRect(0, 0, humCanvas.width, humCanvas.height);
        lightContext.clearRect(0, 0, lightCanvas.width, lightCanvas.height);
    }

    if (id === -1) {
        let data = new Array;
        let timestamps = new Array;
        fillGraph('Temperature', data, timestamps, tempCanvas);
        fillGraph('Pressure', data, timestamps, humCanvas);
        fillGraph('Light', data, timestamps, lightCanvas);
    }
    else{
        let device = await initDevice(id);
        fillGraph('Temperatures', device.temperature, device.timeStamps, tempCanvas);
        if(device.pressure[0]===null) fillGraph('Humidity', device.humidity, device.timeStamps, humCanvas);
        else fillGraph('Pressure', device.pressure, device.timeStamps, humCanvas);
        fillGraph('Light', device.light, device.timeStamps, lightCanvas);
    }
}