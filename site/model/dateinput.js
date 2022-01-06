export async function initDateInputFields()
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
    document.getElementById("beginDate").setAttribute("max", today);
    document.getElementById("endDate").setAttribute("max", today);
    // set standard value of endDate to today as well.
    document.getElementById("endDate").setAttribute("value", today);
    // the date value of beginDate is put to one month ago
    if(mm == '01')
    {
        document.getElementById("beginDate").setAttribute("value", ((yyyy-1) + '-12-01'));
    }
    else
    {
        document.getElementById("beginDate").setAttribute("value", (yyyy + '-' + mmMonthAgo + '-01'));
    }

}

// await function setEndDateToday()
// {

// }

