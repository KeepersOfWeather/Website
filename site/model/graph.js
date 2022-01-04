import { initDevice }  from './device.js';
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

    var tempCanvas = document.getElementById('tempGraph');
    var humCanvas = document.getElementById('humGraph');
    var lightCanvas = document.getElementById('lightGraph');

    var tempContext = tempCanvas.getContext('2d');
    var humContext = humCanvas.getContext('2d');
    var lightContext = lightCanvas.getContext('2d');

    // create the input 'buttons' where we get the date from
    // create date input. 
    var beginDate = document.createElement('input');
    beginDate.type = 'date';
    var endDate = document.createElement('input');
    beginDate.type = 'date';

    // make unique id's and classes
    beginDate.className = 'dateInput';
    beginDate.id = 'BeginDate';
    endDate.className = 'dateInput';
    endDate.id = 'EndDate';

    // add the input dates to the div.
    let tempdiv = document.getElementsByClassName('grid-container');
    if(tempdiv)
    {
        console.log('found the grid-container div');
        tempdiv.innerHTML += beginDate;
        tempdiv.innerHTML += endDate;
    }
    else
    {
        console.log('cant find grid-container div');
    }
   

    // tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    // humContext.clearRect(0, 0, humCanvas.width, humCanvas.height);
    // lightContext.clearRect(0, 0, lightCanvas.width, lightCanvas.height);

    // tempContext.destroy();
    // humContext.destroy();
    // lightContext.destroy();

    if (id === -1) {
        let data = new Array;
        let timestamps = new Array;
        fillGraph('Temperature', data, timestamps, tempContext);
        fillGraph('Pressure', data, timestamps, humContext);
        fillGraph('Light', data, timestamps, lightContext);
    }
    else{
        let device = await initDevice(id);
        fillGraph('Temperatures', device.temperature, device.timeStamps, tempContext);
        if(device.pressure[0]===null) fillGraph('Humidity', device.humidity, device.timeStamps, humContext);
        else fillGraph('Pressure', device.pressure, device.timeStamps, humContext);
        fillGraph('Light', device.light, device.timeStamps, lightContext);
    }
}