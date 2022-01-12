import { initDevice }  from './device.js';
import { getTodayString, displayTimeInputs } from './dateinput.js';
'use strict';

async function fillGraph(title, data, timestamps, ctx, title1, data1, title2, data2,) {

    // if a graph with this context already exists then destroy it to make room for a new graph.
    let oldGraph = Chart.getChart(ctx)
    if(oldGraph)
    {
        oldGraph.destroy();
    }

    if(title === null || data === null)
    {
        title = new Array;
        data = new Array;
    }
    if(title1 === null || data1 === null)
    {
        title1 = new Array;
        data1 = new Array;
    }
    if(title2 === null || data2 === null)
    {
        title2 = new Array;
        data2 = new Array;
    }
    let _data = {
        labels: timestamps,
        datasets: [
            {
                label: title,
                data: data,
                borderColor: 'rgb(255, 99, 132)'
            },
            {
                label: title1,
                data: data1,
                borderColor: 'rgb(102,255,127)'
            },
            {
                label: title2,
                data: data2,
                borderColor: 'rgb(77,77,255)'
            }
        ]
    };

    // let _ = new Chart(ctx, {
    //         type: 'line',
    //         data : {
    //             labels: timestamps,
    //             datasets: [
    //                 {
    //                 label: title,
    //                 data: data,
    //                 borderColor: 'rgb(255, 99, 132)'
    //             }
    //         ]
    //         }
    //     });
    let _ = new Chart(ctx).Line(_data);
}

export async function createGraphs(id, redraw, startDate, endDate) {

    var tempCanvas = document.getElementById('tempGraph');
    var humCanvas = document.getElementById('humGraph');
    var lightCanvas = document.getElementById('lightGraph');

    var tempContext = tempCanvas.getContext('2d');
    var humContext = humCanvas.getContext('2d');
    var lightContext = lightCanvas.getContext('2d');
   

    // if(endDate == null) endDate = getTodayString();
    // if(startDate == null) startDate = getTodayString(-1);

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

    if(!redraw) {displayTimeInputs(id);}
    //initTimeInputs();  
}