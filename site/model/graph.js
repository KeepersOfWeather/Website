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

    if(data !== undefined)
    {
        numberOfGraphs++;
    }
    if(data1 !== undefined)
    {
        numberOfGraphs++;
    }
    if(data2 !== undefined)
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

export async function createGraphs(fresh) {

    var tempCanvas = document.getElementById('tempGraph');
    var humCanvas = document.getElementById('humGraph');
    var lightCanvas = document.getElementById('lightGraph');

    var tempContext = tempCanvas.getContext('2d');
    var humContext = humCanvas.getContext('2d');
    var lightContext = lightCanvas.getContext('2d');

    if(fresh) {displayTimeInputs();}
    let fromDate = document.getElementById("fromDate");
    let fromTime = document.getElementById("fromTime");
    let tillDate = document.getElementById("untillDate");
    let tillTime = document.getElementById("untillTime");
    let startDate = fromDate.value + ' ' + fromTime.value;
    let endDate = tillDate.value + ' ' + tillTime.value;

    let arrayOfCheckboxes = document.getElementsByClassName('deviceCheckboxes');
    let ids = new Array;
    for(let i=0; i<arrayOfCheckboxes.length; i++){
        if(arrayOfCheckboxes[i].checked) ids.push(arrayOfCheckboxes[i].id);
    }
    
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
            device = await initDevice(ids[0], startDate, endDate);
            fillGraph(device.name, device.temperature, device.timeStamps, tempContext);
            if(device.pressure[0]===null) fillGraph(device.name, device.humidity, device.timeStamps, humContext);
            else fillGraph(device.name, device.pressure, device.timeStamps, humContext);
            fillGraph(device.name, device.light, device.timeStamps, lightContext);
            displayMetadata(device.name,device.connection,device.battery,true);
        }
        else if(ids.length == 2){
            device = await initDevice(ids[0], startDate, endDate);
            let device1 = await initDevice(ids[1], startDate, endDate);
            fillGraph(device.name, device.temperature, device.timeStamps, tempContext,device1.name,device1.temperature);
            if(device.pressure[0]===null) fillGraph(device.name, device.humidity, device.timeStamps, humContext,device1.name,device1.humidity);
            else fillGraph(device.name, device.pressure, device.timeStamps, humContext,device1.name,device1.pressure);
            fillGraph(device.name, device.light, device.timeStamps, lightContext,device1.name,device1.light);
            displayMetadata(device.name,device.connection,device.battery,true);
            displayMetadata(device1.name,device1.connection,device1.battery,false);
        }
        else if(ids.length == 3){
            device = await initDevice(ids[0], startDate, endDate);
            let device1 = await initDevice(ids[1], startDate, endDate);
            let device2 = await initDevice(ids[2], startDate, endDate);
            fillGraph(device.name, device.temperature, device.timeStamps, tempContext,device1.name,device1.temperature,device2.name,device2.temperature);
            if(device.pressure[0]===null) fillGraph(device.name, device.humidity, device.timeStamps, humContext,device1.name,device1.humidity,device2.name,device2.humidity);
            else fillGraph(device.name, device.pressure, device.timeStamps, humContext,device1.name,device1.pressure,device2.name,device2.pressure);
            fillGraph(device.name, device.light, device.timeStamps, lightContext,device1.name,device1.light,device2.name,device2.light);
            displayMetadata(device.name,device.connection,device.battery,true);
            displayMetadata(device1.name,device1.connection,device1.battery,false);
            displayMetadata(device2.name,device2.connection,device2.battery,false);
        }
    }
}

export async function resetGraphs(){
    await createGraphs(true);
}

function displayMetadata(name,rssi,battery,fresh){
    let div = document.getElementsByClassName("metadata");
    if (div.length !== 0) {
        div = div[0];
    } else {
        console.log("Something is broken when finding tabs div...")
        return;
    }
    if(fresh)div.innerHTML = "";

    const conn_header0 = document.createTextNode("Connection: ");
    const conn_header1 = document.createTextNode(name);
    let connection;
    console.log(rssi);
    if(rssi<=-90) connection = document.createTextNode(" => unstable.\n");// extremely weak
    else if(rssi<-64) connection = document.createTextNode(" => weak.\n");// ehh
    else if(rssi<-55) connection = document.createTextNode(" => good.\n");// ok
    else if(rssi<-33) connection = document.createTextNode(" => strong.\n");// strong
    else connection = document.createTextNode(" => very strong.\n");// extremely strong

    div.appendChild(conn_header0);
    div.appendChild(conn_header1);
    div.appendChild(connection);
    console.log(battery);
    if(battery !== undefined){
        const bat_header0 = document.createTextNode("Battery: ");
        const bat_header1 = document.createTextNode(name);
        let battery;
        if(battery>=3.0) battery = document.createTextNode(" => full.\n");//full
        else if(battery>=2.5) battery = document.createTextNode(" => medium.\n");//medium
        else battery = document.createTextNode(" => low.\n");//low

        div.appendChild(bat_header0);
        div.appendChild(bat_header1);
        div.appendChild(battery);
    }
}