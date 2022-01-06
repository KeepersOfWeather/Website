function beginDateOnChange()
{
    console.log("Begin Date Changed");
    var firstdate = document.getElementById("beginDate").value;
    // document.getElementById("endDate").value = firstdate;
    document.getElementById("endDate").setAttribute("min",firstdate);
}

function endDateOnChange()
{
    console.log("End Date Changed");
}