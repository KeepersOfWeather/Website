import { api_query }  from './api.js';
import {createGraphs, resetGraphs} from './graph.js';
import { updateLatestWeatherDiv }  from './latestWeather.js';
'use strict';

function removeActiveFromButtons() {
    let citiesClass = document.getElementsByClassName("cities-nav");

    if (citiesClass.length === 0)  {
        console.log("Something is broken when finding tabs div...")
        return;
    }

    let buttonList = citiesClass[0].childNodes;

    for (var i = 0; i < buttonList.length; i++) {
        buttonList[i].classList.remove("active");
    }
}

async function getLatestForLocation(location) {
    let cities = await api_query('locations');

    var newestData = {};
    var fromDeviceId = undefined;

    // https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
    for (const [locationEntry] of Object.entries(cities)) {

        if (locationEntry.City === location) {
            for (const [City, deviceID, deviceNumber] of Object.entries(locationEntry)) {
                var latestFromDevice = await api_query(`device/${forDeviceID}/latest`);
                
                latestFromDevice = latestFromDevice[0];

                let timestampDate = new Date(latestFromDevice.metadata.utcTimeStamp);

                var latestDate = new Date('1970-01-01T00:00:00');

                if (newestData.metadata !== undefined) {
                    latestDate = new Date(newestData.metadata.utcTimeStamp);
                } 
                
                if (timestampDate > latestDate) {
                    newestData = latestFromDevice;
                    fromDeviceId = id;
                }
            }
        }
    }

    return {fromDeviceId, newestData};
}

/// This function will fill up the devices list with devices passed as id: device in deviceCollection
/// param deviceCollection: dictionary
async function createDeviceList(devicesCollection) {
    let devicesList = document.getElementsByClassName("devices");

    if (devicesList.length !== 0) {
        devicesList = devicesList[0];
    } else {
        console.log("Something is broken when finding devices ul...")
        return;
    }

    // Clear list of devices
    devicesList.innerHTML = "";

    // Go over each id and name in the passed dictionary
    for (const [deviceId, deviceName] of Object.entries(devicesCollection)) {

        if(deviceName.includes("haaksbergerstraat")){
            // do nothing 
        }
        else{
        // Create a div with a check box and a label
        let newDeviceEntry = document.createElement("div");

            let newDeviceCheckBox = document.createElement("input");
            newDeviceCheckBox.type = "checkbox";
            newDeviceCheckBox.classList.add("deviceCheckboxes");
            newDeviceCheckBox.id = deviceId;
            newDeviceCheckBox.name = deviceName;
            if (typeof variable === 'undefined')
            {
                var numOfCheckboxesSelected = 0;
            }
            if (typeof arrayOfCheckboxes === 'undefined')
            {
                var arrayOfCheckboxes = document.getElementsByClassName("deviceCheckboxes");
            }

            newDeviceCheckBox.onclick = async function () {
                arrayOfCheckboxes = document.getElementsByClassName('deviceCheckboxes');
                let city = document.getElementsByClassName("city active");
                if(newDeviceCheckBox.checked){
                    console.log('checked');
                    // creat graphs with graphs selected graphs
                    numOfCheckboxesSelected++;
                    // if (numOfCheckboxesSelected == 3)
                    // {
                    //     for (let i = 0; i < arrayOfCheckboxes.length;i++) {
                    //         if(!arrayOfCheckboxes[i].checked)
                    //         {
                    //             arrayOfCheckboxes[i].disabled = true;
                    //         }
                    //       }
                    // }
                    if(city[0].id == "All"){
                        console.log("ALL CITY active");
                        if(newDeviceCheckBox.id == 0 || newDeviceCheckBox.id == 1){
                            arrayOfCheckboxes[2].disabled = true;
                            arrayOfCheckboxes[3].disabled = true;
                        }
                        else{
                            arrayOfCheckboxes[0].disabled = true;
                            arrayOfCheckboxes[1].disabled = true;
                        }
                    }
                    else if(city[0].id =="Wierden"){
                        console.log("Wierden CITY active");
                        if(newDeviceCheckBox.id == 0){
                            arrayOfCheckboxes[1].disabled = true;
                        }
                        else{
                            arrayOfCheckboxes[0].disabled = true;
                        }
                    }
                } 
                else {
                    console.log('unchecked');
                    // creat graphs with graphs selected graphs
                    numOfCheckboxesSelected--;
                    // for (let i = 0; i < arrayOfCheckboxes.length;i++){
                    //     arrayOfCheckboxes[i].disabled = false;
                    //   }
                    if(numOfCheckboxesSelected == 0){
                        for(let i=0; i<arrayOfCheckboxes.length; i++){
                            arrayOfCheckboxes[i].disabled = false;
                        }
                    }
                }
                if(!checkIfDateMoreThan2Days())
                {
                    createGraphs(false);
                }
                
                console.log('numOfCheckBoxes: ' + numOfCheckboxesSelected);
                console.log(deviceName);
            }

            let newDeviceLabel = document.createElement("label");
            newDeviceLabel.htmlFor = deviceName;
            newDeviceLabel.innerHTML = deviceName;

        // Add the checkbox and label for the checkbox
        // To the div for the new entry
        newDeviceEntry.appendChild(newDeviceCheckBox);
        newDeviceEntry.appendChild(newDeviceLabel);

        // Add the new entry to our list of devices
        devicesList.appendChild(newDeviceEntry);
    }
    }
}

async function buienRadar(city) {

    //https://stackoverflow.com/questions/8726455/creating-an-iframe-using-javascript
    let ifrmRad = document.getElementById("radar");
    let ifrmForecast = document.getElementById("forecast")
        ifrmRad.height = 256;
        ifrmForecast.width = 300;
        ifrmForecast.height = 190;
var radAll = "https://gadgets.buienradar.nl/gadget/radarfivedays";
    var radDefault = "https://gadgets.buienradar.nl/gadget/zoommap/?lat=52.755&lng=5.96528&overname=2&zoom=6&naam=Nederland&size=2&voor=1";
    var radEanske = "https://gadgets.buienradar.nl/gadget/zoommap/?lat=52.21833&lng=6.89583&overname=2&zoom=11&naam=Enschede&size=2&voor=0";
    var radWierden = "https://gadgets.buienradar.nl/gadget/zoommap/?lat=52.35917&lng=6.59306&overname=2&zoom=13&naam=Wierden&size=2&voor=0";
    var radGronau = "https://gadgets.buienradar.nl/gadget/zoommap/?lat=52.21099&lng=7.02238&overname=2&zoom=13&naam=Gronau&size=2&voor=0";
    var twente5 = "https://gadgets.buienradar.nl/gadget/forecastandstation/6260"
    if (city === "All") {
        ifrmRad.height = 406;
        ifrmRad.src = radAll;
        ifrmForecast.width = 0;
        ifrmForecast.height = 0;
    } else if(city === "Enschede") {
        ifrmRad.src = radEanske;
        ifrmForecast.src = twente5;
    }else if(city === "Wierden") {
        ifrmRad.src = radWierden;
        ifrmForecast.src = twente5;
    } else if (city === "Gronau") {
        ifrmRad.src = radGronau;
    }else ifrmRad.src = radDefault;
}

export async function createNavBar() {
    // Begin by asking API for all devices sorted by location
    // Generate tabs dynamically: https://www.w3schools.com/howto/howto_js_tabs.asp
    let cities = await api_query('locations');

    // Grab cities Div from index.html
    let citiesDiv = document.getElementsByClassName("cities-nav");

    if (citiesDiv.length !== 0) {
        citiesDiv = citiesDiv[0];
    } else {
        console.log("Something is broken when finding tabs div...")
        return;
    }

    let allButton = document.createElement("button");
        
    allButton.classList.add("city");
    // allButton.classList.add("active");
    allButton.id = "All";

    let allDevices = await api_query('devices');

    allButton.onclick = async function () {

        removeActiveFromButtons();
        allButton.classList.add("active");
        createDeviceList(allDevices);
        await updateLatestWeatherDiv();
        await buienRadar(this.id);
    };

    allButton.innerHTML = "All"; // Change the name to be the city name

    citiesDiv.appendChild(allButton);

    // Iterate through each location stored cities
    // https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
    for (const [cityName, deviceList] of Object.entries(cities)) {

        // Generate a button for each availiable location recieved from the API 
        // https://www.w3schools.com/jsref/met_node_appendchild.asp

        let newCityButton = document.createElement("button");
        
        newCityButton.classList.add("city"); 
        newCityButton.id = cityName;

        // When 
        newCityButton.onclick = async function () {
            //this.id returns the id of the clicked button
            await buienRadar(this.id);
            removeActiveFromButtons();
            newCityButton.classList.add("active");
            createDeviceList(deviceList);
            let latestDataFromLocation = await getLatestForLocation(deviceList); //double query?
            await updateLatestWeatherDiv(latestDataFromLocation.fromDeviceId);
            resetGraphs();
        };

        newCityButton.innerHTML = cityName; // rename the button
        
        citiesDiv.appendChild(newCityButton);
    }

    allButton.classList.add("active");
    createDeviceList(allDevices);
    await updateLatestWeatherDiv();
    await buienRadar("All");
}

function checkIfDateMoreThan2Days()
{
    var _fromDate = document.getElementById("fromDate").value;
    var _untillDate = document.getElementById("untillDate").value;
    var _fromDateSplit = _fromDate.split('-');      // 0 = yyyy, 1 = mm, 2 = dd
    var _untillDateSplit = _untillDate.split('-');  // 0 = yyyy, 1 = mm, 2 = dd

    var date1From = new Date(_fromDateSplit[1] + '/' + _fromDateSplit[2] + '/' + _fromDateSplit[0]); // this needs to be in mm/dd/yyyy
    var date2Untill = new Date(_untillDateSplit[1] + '/' + _untillDateSplit[2] + '/' + _untillDateSplit[0]);

    var Difference_In_Time = date2Untill.getTime() - date1From.getTime();

    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    if (Difference_In_Days > 6)
    {
        document.getElementById('warningText').style.visibility = 'visible';
        return true;
    }
    else
    {
        document.getElementById('warningText').style.visibility = 'hidden';
        return false;
    }
}