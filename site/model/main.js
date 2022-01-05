import {createNavBar} from './nav.js';
import {createGraphs} from './graph.js';
import {initDateInputFields} from './dateinput.js';

(async () => {
    await createNavBar();

    await createGraphs(-1);

    await initDateInputFields();
})();