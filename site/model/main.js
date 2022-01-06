import {createNavBar} from './nav.js';
import {createGraphs} from './graph.js';
import {initDateInputFields} from './dateinput.js';

function endDateOnChange()
{
    console.log("End Date Changed");
}

function beginDateOnChange()
{
    console.log("Begin Date Changed");
}

(async () => {
    await createNavBar();

    await createGraphs(-1);

    await initDateInputFields();
})();