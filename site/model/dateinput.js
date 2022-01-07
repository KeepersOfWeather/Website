export function displayTimeInputs() {
    let dateDiv = document.getElementsByClassName("date-container");

    if (dateDiv.length !== 0) {
        dateDiv = dateDiv[0];
    } else {
        console.log("Something is broken when finding tabs div...")
        return;
    }

    let selectFrom = document.createElement("div");
    let startDate = document.createElement("input");

    startDate.type = "date";
    startDate.id = "fromDate";
    startDate.name = "fromDate";
    startDate.value = "2018-07-22";
    startDate.min = "2021-10-01";
    startDate.max = "2018-12-31";
    startDate.onchange = async function fromDateOnChange() {

    }

    let startDateLabel = document.createElement("label");
    startDateLabel.htmlFor = "fromDate";
    startDateLabel.innerHTML = "fromDate";

    selectFrom.appendChild(startDateLabel);
    selectFrom.appendChild(startDate);

    dateDiv.appendChild(selectFrom);

    let selectTill = document.createElement("div");
    let endDate = document.createElement("input");

    endDate.type = "date";
    endDate.id = "untillDate";
    endDate.name = "untillDate";
    endDate.value = "2018-07-22";
    endDate.min = "2021-10-01";
    endDate.max = "2018-12-31";
    endDate.onchange = async function untillDateOnChange(){

    }

    let endDateLabel = document.createElement("label");
    endDateLabel.htmlFor = "untillDate";
    endDateLabel.innerHTML = "untillDate";

    selectTill.appendChild(endDateLabel);
    selectTill.appendChild(endDate);

    dateDiv.appendChild(selectTill);
}

export function initTimeInputs()
{

    // this code puts the latest date they can request to today.
    var today = new Date();
    var dd = today.getDate();
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
    document.getElementById("fromDate").setAttribute("max", today);
    document.getElementById("untillDate").setAttribute("max", today);
    // set standard value of endDate to today as well. 
    document.getElementById("untillDate").setAttribute("value", today);
    // the date value of beginDate is put to one month ago
    if(mm == '01')
    {
        document.getElementById("fromDate").setAttribute("value", ((yyyy-1) + '-12-01'));
    }
    else
    {
        document.getElementById("fromDate").setAttribute("value", (yyyy + '-' + mmMonthAgo + '-01'));
    }

}

// await function setEndDateToday()
// {

// }

