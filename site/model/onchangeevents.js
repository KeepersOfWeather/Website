function fromDateOnChange()
{
    console.log("from Date Changed");
    var newMinDate = document.getElementById("fromDate").value;
    // document.getElementById("untillDate").value = newMinDate;
    document.getElementById("untillDate").setAttribute("min",newMinDate);
}

function untillDateOnChange()
{
    console.log("untill Date Changed");
}