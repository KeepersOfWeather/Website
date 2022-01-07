import {createNavBar} from './nav.js';
import {createGraphs} from './graph.js';



(async () => {
    await createNavBar();

    await createGraphs(-1);
})();