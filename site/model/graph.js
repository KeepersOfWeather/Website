import { initDevice }  from './device.js';
import { getTodayString, displayTimeInputs, initTimeInputs } from './dateinput.js';
'use strict';

async function fillGraph(title, data, timestamps, ctx) {

    // if a graph with this context already exists then destroy it to make room for a new graph.
    let oldGraph = Chart.getChart(ctx)
    if(oldGraph)
    {
        oldGraph.destroy();
    }

    let _ = new Chart(ctx, {
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

export async function createGraphs(id, startDate, endDate) {

    var tempCanvas = document.getElementById('tempGraph');
    var humCanvas = document.getElementById('humGraph');
    var lightCanvas = document.getElementById('lightGraph');

    var tempContext = tempCanvas.getContext('2d');
    var humContext = humCanvas.getContext('2d');
    var lightContext = lightCanvas.getContext('2d');
   

    if(endDate == null) endDate = getTodayString();
    if(startDate == null) startDate = getTodayString(-1);

    if (id === -1) {
        let data = new Array;
        let timestamps = new Array;
        fillGraph('Temperature', data, timestamps, tempContext);
        fillGraph('Pressure', data, timestamps, humContext);
        fillGraph('Light', data, timestamps, lightContext);
    }
    else{
        let device = await initDevice(id, startDate, endDate);
        fillGraph('Temperatures', device.temperature, device.timeStamps, tempContext);
        if(device.pressure[0]===null) fillGraph('Humidity', device.humidity, device.timeStamps, humContext);
        else fillGraph('Pressure', device.pressure, device.timeStamps, humContext);
        fillGraph('Light', device.light, device.timeStamps, lightContext);
    }

    displayTimeInputs(id);
    initTimeInputs();  
}