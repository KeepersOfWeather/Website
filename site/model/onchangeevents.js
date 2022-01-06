function fromDateOnChange()
{
    console.log("from Date Changed");
    var newMinDate = document.getElementById("beginDate").value;
    // document.getElementById("endDate").value = newMinDate;
    document.getElementById("endDate").setAttribute("min",newMinDate);
}

function untillDateOnChange()
{
    console.log("untill Date Changed");
}