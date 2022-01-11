import {createGraphs} from './graph.js';

export function getTodayString(day){
    if(day == null) day = 0;
    // this code puts the latest date they can request to today.
    var today = new Date();
    var dd = today.getDate() - day;
    var mm = today.getMonth() + 1; //January is 0!
    var mmMonthAgo = today.getMonth(); //the month of one month ago
    var yyyy = today.getFullYear();

    if (dd < 10) {
    dd = '0' + dd;
    }

    if (mm < 10) {
    mmMonthAgo = '0' + mmMonthAgo;
    mm = '0' + mm;
    } 
        
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

export function displayTimeInputs(currentGraph) {
    let dateDiv = document.getElementsByClassName("date-container");

    if (dateDiv.length !== 0) {
        dateDiv = dateDiv[0];
    } else {
        console.log("Something is broken when finding tabs div...")
        return;
    }

    // if these already exist then they will get deleted to not duplicate
    let check_from_date = document.getElementById("fromDate");
    let check_untill_date = document.getElementById("untillDate");

    if (check_from_date && check_untill_date)
    {
        // document.getElementById('selectFrom').removeChild(check_from_date);
        // document.getElementById('selectFrom').removeChild(document.getElementById('startDateLabel'))
        // document.getElementById('selectTill').removeChild(check_untill_date);
        // document.getElementById('selectTill').removeChild(document.getElementById('endDateLabel'))
        document.getElementById('selectFrom').remove();
        document.getElementById('selectTill').remove();
    }

    let selectFrom = document.createElement("div");
    selectFrom.id = 'selectFrom';
    let startDate = document.createElement("input");
    let startTime = document.createElement("input");

    // this code puts the latest date they can request to today.
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var mmMonthAgo = today.getMonth(); //the month of one month ago
    var yyyy = today.getFullYear();
    var timeToday = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric"});

    

    if (dd < 10) {
    dd = '0' + dd;
    }

    if (mm < 10) {
    mmMonthAgo = '0' + mmMonthAgo;
    mm = '0' + mm;
    } 
        
    today = yyyy + '-' + mm + '-' + dd;
    //document.getElementById("fromDate").setAttribute("max", today);
    //document.getElementById("untillDate").setAttribute("max", today);
    //// set standard value of endDate to today as well. 
    //document.getElementById("untillDate").setAttribute("value", today);
    //// the date value of beginDate is put to one month ago
    var todayMonthAgo = today;
    if(mm == '01')
    {
        todayMonthAgo = (yyyy-1) + '-12-01';
        //document.getElementById("fromDate").setAttribute("value", ((yyyy-1) + '-12-01'));
    }
    else
    {
        todayMonthAgo = yyyy + '-' + mmMonthAgo + '-01';
        //document.getElementById("fromDate").setAttribute("value", (yyyy + '-' + mmMonthAgo + '-01'));
    }

    startDate.type = "date";
    startDate.id = "fromDate";
    startDate.name = "fromDate";
    startDate.value = todayMonthAgo;
    startDate.min = "2021-10-01";
    startDate.max = today;
    startDate.onchange = async function fromDateOnChange() {
        console.log("from Date Changed");
        console.log('Time today is: '+timeToday)
        var newMinDate = document.getElementById("fromDate").value;
        // document.getElementById("untillDate").value = newMinDate;
        document.getElementById("untillDate").setAttribute("min",newMinDate);
        createGraphs(currentGraph, startDate.toString, endDate.toString);
    }

    let startDateLabel = document.createElement("label");
    startDateLabel.id = 'startDateLabel';
    startDateLabel.htmlFor = "fromDate";
    startDateLabel.innerHTML = "From date: ";

    selectFrom.appendChild(startDateLabel);
    selectFrom.appendChild(startDate);

    dateDiv.appendChild(selectFrom);

    let selectTill = document.createElement("div");
    selectTill.id = 'selectTill';
    let endDate = document.createElement("input");

    endDate.type = "date";
    endDate.id = "untillDate";
    endDate.name = "untillDate";
    endDate.value = today;
    endDate.min = todayMonthAgo;
    endDate.max = today;
    endDate.onchange = async function untillDateOnChange(){
        console.log("untill Date Changed");
        console.log('Time today is: '+timeToday)
        var newMaxDate = document.getElementById("untillDate").value;
        // document.getElementById("untillDate").value = newMinDate;
        document.getElementById("fromDate").setAttribute("max",newMaxDate);
        createGraphs(currentGraph, startDate.toString, endDate.toString);
    }

    let endDateLabel = document.createElement("label");
    endDateLabel.id = 'endDateLabel';
    endDateLabel.htmlFor = "untillDate";
    endDateLabel.innerHTML = "Untill date: ";

    selectTill.appendChild(endDateLabel);
    selectTill.appendChild(endDate);

    dateDiv.appendChild(selectTill);
}

// export function initTimeInputs()
// {
//     let today = getTodayString();
    
//     document.getElementById("fromDate").setAttribute("max", today);
//     document.getElementById("untillDate").setAttribute("max", today);
//     // set standard value of endDate to today as well. 
//     document.getElementById("untillDate").setAttribute("value", today);
//     // the date value of beginDate is put to one month ago
//     if(mm == '01')
//     {
//         document.getElementById("fromDate").setAttribute("value", ((yyyy-1) + '-12-01'));
//     }
//     else
//     {
//         document.getElementById("fromDate").setAttribute("value", (yyyy + '-' + mmMonthAgo + '-01'));
//     }

// }

// await function setEndDateToday()
// {

// }

