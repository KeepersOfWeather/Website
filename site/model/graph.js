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
    const tempCanvas = document.getElementById('tempDataChart');
    const humCanvas = document.getElementById('humDataChart');
    const lightCanvas = document.getElementById('lightDataChart');

    var tempContext = tempCanvas.getContext('2d');
    var humContext = humCanvas.getContext('2d');
    var lightContext = lightCanvas.getContext('2d');

    tempContext.clear();
    humContext.clear();
    lightContext.clear();

    if (id === -1) {
        let data = new Array;
        let timestamps = new Array;
        fillGraph('Temperature', data, timestamps, ctx);
        fillGraph('Pressure', data, timestamps, ctx1);
        fillGraph('Light', data, timestamps, ctx2);
    }
    else{
        let device = await initDevice(id);
        fillGraph('Temperatures', device.temperature, device.timeStamps, ctx);
        if(device.pressure[0]===null) fillGraph('Humidity', device.humidity, device.timeStamps, ctx1);
        else fillGraph('Pressure', device.pressure, device.timeStamps, ctx1);
        fillGraph('Light', device.light, device.timeStamps, ctx2);
    }
}