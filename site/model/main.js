import {createNavBar} from './nav';
import {createGraphs} from './graph';

(async () => {
    await createNavBar();

    await createGraphs();
})();