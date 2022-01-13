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

export function displayTimeInputs() {
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
    mm = '0' + mm;
    } 

    if (mmMonthAgo < 10){
    mmMonthAgo = '0' + mmMonthAgo;
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
        //var testBool = checkIfDateMoreThan2Days();
        console.log("from Date Changed");
        var newMinDate = document.getElementById("fromDate").value;
        // document.getElementById("untillDate").value = newMinDate;
        document.getElementById("untillDate").setAttribute("min",newMinDate);

        if(!checkIfDateMoreThan2Days())
        {
            createGraphs(false);
        }
        

        console.log(startDate.value);
        console.log(startDate.value + ' ' + startTime.value);
    }

    let startDateLabel = document.createElement("label");
    startDateLabel.id = 'startDateLabel';
    startDateLabel.htmlFor = "fromDate";
    startDateLabel.innerHTML = "From date: ";

    startTime.type = "time";
    startTime.id = "fromTime";
    startTime.name = "fromTime";
    startTime.value = "00:00";
    startTime.min = "00:00";
    startTime.max = "23:59";
    startTime.onchange = async function fromTimeOnChange() {
        console.log("from Time Changed");
        if (document.getElementById("fromDate").value === document.getElementById("untillDate").value)
        {
            var newMinTime = document.getElementById("fromTime").value;
            // document.getElementById("untillDate").value = newMinDate;
            document.getElementById("untillTime").setAttribute("min",newMinTime);
        }

        if(!checkIfDateMoreThan2Days())
        {
            createGraphs(false);
        }

        console.log(startTime.value);
        console.log(startDate.value + ' ' + startTime.value);
    }

    selectFrom.appendChild(startDateLabel);
    selectFrom.appendChild(startDate);
    selectFrom.appendChild(startTime);

    dateDiv.appendChild(selectFrom);

    let selectTill = document.createElement("div");
    selectTill.id = 'selectTill';
    let endDate = document.createElement("input");
    let endTime = document.createElement("input");

    endDate.type = "date";
    endDate.id = "untillDate";
    endDate.name = "untillDate";
    endDate.value = today;
    endDate.min = todayMonthAgo;
    endDate.max = today;
    endDate.onchange = async function untillDateOnChange(){
        var testBool = checkIfDateMoreThan2Days();
        console.log("untill Date Changed");
        var newMaxDate = document.getElementById("untillDate").value;
        // document.getElementById("untillDate").value = newMinDate;
        document.getElementById("fromDate").setAttribute("max",newMaxDate);

        console.log(endDate.toString());
        console.log(endDate.toString + ' ' + endTime.toString());

        if(!checkIfDateMoreThan2Days())
        {
            createGraphs(false);
        }
    }

    let endDateLabel = document.createElement("label");
    endDateLabel.id = 'endDateLabel';
    endDateLabel.htmlFor = "untillDate";
    endDateLabel.innerHTML = "Untill date: ";

    endTime.type = "time";
    endTime.id = "untillTime";
    endTime.name = "untillTime";
    endTime.value = timeToday;
    endTime.min = "00:00";
    endTime.max = "23:59";
    endTime.onchange = async function untillTimeOnChange(){
        console.log("untill Time Changed");
        if (document.getElementById("fromDate").value === document.getElementById("untillDate").value)
        {
            var newMaxTime = document.getElementById("untillTime").value;
            // document.getElementById("untillDate").value = newMinDate;
            document.getElementById("fromTime").setAttribute("max",newMaxTime);
        }

        console.log(endTime.value);
        console.log(endDate.value + ' ' + endTime.value);
        
        if(!checkIfDateMoreThan2Days())
        {
            createGraphs(false);
        }
    }

    selectTill.appendChild(endDateLabel);
    selectTill.appendChild(endDate);
    selectTill.appendChild(endTime);

    dateDiv.appendChild(selectTill);
    var warningText = document.createElement("p");
    warningText.id = 'warningText';
    warningText.innerHTML = 'Dataset too large. Choose something thats within 7 days.'
    warningText.style.visibility = "hidden";
    dateDiv.appendChild(warningText);

    SetBackStartTime2HoursAgo();
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

function AmsterdamTimeToUKTime(timeString)
{
    var newTime = timeString.split(':');
    var hours = parseInt(newTime[0]);
    var hoursString;
    if (hours == 0)
    {
        hoursString = '23'
    }
    else
    {
        hours = hours - 1;
        if (hours >= 0 && hours < 10)
        {
            hoursString = '0' + hours.toString();
        }
        else
        {
            hoursString = hours.toString();
        }
    }
    return hoursString + ':' + newTime[1];
}

function SetBackStartTime2HoursAgo()
{
    var time_now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric"});
    var split_time_now = time_now.split(':');
    var hours = parseInt(split_time_now[0]);
    var hoursString;
    if (hours == 0 || hours == 1)
    {
        hours = hours + 22;

        var today = new Date();
        var dd = today.getDate() - 1; // we get yesterday
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
        dd = '0' + dd;
        }
        
        if (mm < 10) {
        mm = '0' + mm;
        } 

        document.getElementById("fromDate").value = yyyy + '-' + mm + '-' + dd;
    }
    else
    {
        hours = hours - 2;

        var today = new Date();
        var dd = today.getDate(); // we get yesterday
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
        dd = '0' + dd;
        }
        
        if (mm < 10) {
        mm = '0' + mm;
        } 

        document.getElementById("fromDate").value = yyyy + '-' + mm + '-' + dd;

    }

    if (hours >= 0 && hours < 10)
    {
        hoursString = '0' + hours.toString();
    }
    else
    {
        hoursString = hours.toString();
    }

    document.getElementById("fromTime").value = hoursString + ':' + split_time_now[1];
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