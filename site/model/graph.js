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

export async function createGraphs() {
    var id = 1;

    if (id === -1) {
        let data = new Array;
        let timestamps = new Array;
        fillGraph('Temperature', data, timestamps, ctx);
    }
    else{
        let device = await initDevice(id);
        console.log(`Display data for device: ${await device.name}`)

        const ctx = document.getElementById('tempDataChart');
        const ctx1 = document.getElementById('humDataChart');
        const ctx2 = document.getElementById('lightDataChart');

        fillGraph('Temperatures', device.temperature, device.timeStamps, ctx);
    }
}