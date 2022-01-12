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

    let numberOfGraphs=0;
    // if(title === null || data === null)
    // {
    //     title = new Array;
    //     data = new Array;
    // }
    // else
    // {
    //     numberOfGraphs++;
    // }
    // if(title1 === null || data1 === null)
    // {
    //     title1 = new Array;
    //     data1 = new Array;
    // }
    // else
    // {
    //     numberOfGraphs++;
    // }
    // if(title2 === null || data2 === null)
    // {
    //     title2 = new Array;
    //     data2 = new Array;
    // }
    // else
    // {
    //     numberOfGraphs++;
    // }

    if(!(title === null || data === null))
    {
        numberOfGraphs++;
    }
    if(!(title1 === null || data1 === null))
    {
        numberOfGraphs++;
    }
    if(!(title2 === null || data2 === null))
    {
        numberOfGraphs++;
    }

    console.log("The numberOfGraphs is: "+numberOfGraphs);
    // let _data = {
    //     labels: timestamps,
    //     datasets: [
    //         {
    //             label: title,
    //             data: data,
    //             borderColor: 'rgb(255, 99, 132)'
    //         },
    //         {
    //             label: title1,
    //             data: data1,
    //             borderColor: 'rgb(102,255,127)'
    //         },
    //         {
    //             label: title2,
    //             data: data2,
    //             borderColor: 'rgb(77,77,255)'
    //         }
    //     ]
    // };

    if(numberOfGraphs == 1)
    {
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
    else if(numberOfGraphs == 2)
    {
        let _ = new Chart(ctx, {
            type: 'line',
            data : {
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
                }
            ]
            }
        });
    }
    else if(numberOfGraphs == 3)
    {
        let _ = new Chart(ctx, {
            type: 'line',
            data : {
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
            }
        });
    }
    // let _ = new Chart(ctx).Line(_data);
}

export async function createGraphs(ids, redraw, startDate, endDate) {

    var tempCanvas = document.getElementById('tempGraph');
    var humCanvas = document.getElementById('humGraph');
    var lightCanvas = document.getElementById('lightGraph');

    var tempContext = tempCanvas.getContext('2d');
    var humContext = humCanvas.getContext('2d');
    var lightContext = lightCanvas.getContext('2d');
   

    // if(endDate == null) endDate = getTodayString();
    // if(startDate == null) startDate = getTodayString(-1);

    if (ids === undefined || ids.length == 0) {
        let data = new Array;
        let timestamps = new Array;
        fillGraph('Temperature', data, timestamps, tempContext);
        fillGraph('Pressure', data, timestamps, humContext);
        fillGraph('Light', data, timestamps, lightContext);
    }
    else{
        let device;
        if(ids.length == 1) {
            device = await initDevice(id[0], startDate, endDate);
            fillGraph(device.name, device.temperature, device.timeStamps, tempContext);
            if(device.pressure[0]===null) fillGraph(device.name, device.humidity, device.timeStamps, humContext);
            else fillGraph(device.name, device.pressure, device.timeStamps, humContext);
            fillGraph(device.name, device.light, device.timeStamps, lightContext);
        }
        else if(ids.length == 2){
            device = await initDevice(id[0], startDate, endDate);
            let device1 = await initDevice(id[1], startDate, endDate);
            fillGraph(device.name, device.temperature, device.timeStamps, tempContext,device1.name,device1.temperature);
            if(device.pressure[0]===null) fillGraph(device.name, device.humidity, device.timeStamps, humContext,device1.name,device1.humidity);
            else fillGraph(device.name, device.pressure, device.timeStamps, humContext,device1.name,device1.pressure);
            fillGraph(device.name, device.light, device.timeStamps, lightContext,device1.name,device1.light);
        }
        else if(ids.length == 3){
            device = await initDevice(id[0], startDate, endDate);
            let device1 = await initDevice(id[1], startDate, endDate);
            let device2 = await initDevice(id[2], startDate, endDate);
            fillGraph(device.name, device.temperature, device.timeStamps, tempContext,device1.name,device1.temperature,device2.name,device2.temperature);
            if(device.pressure[0]===null) fillGraph(device.name, device.humidity, device.timeStamps, humContext,device1.name,device1.humidity,device2.name,device2.humidity);
            else fillGraph(device.name, device.pressure, device.timeStamps, humContext,device1.name,device1.pressure,device2.name,device2.pressure);
            fillGraph(device.name, device.light, device.timeStamps, lightContext,device1.name,device1.light,device2.name,device2.light);
        }
    }

    if(!redraw) {displayTimeInputs(ids);}
}