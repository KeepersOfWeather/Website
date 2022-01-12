import {createNavBar} from './nav.js';
import {createGraphs} from './graph.js';



(async () => {
    await createNavBar();
    await createGraphs(-1);

    await createGraphs(1, '2022-01-02 16:00:00', '2022-01-02 18:00:00');
    await createGraphs(2, '2022-01-02 16:00:00', '2022-01-02 18:00:00');
    await createGraphs(3, '2022-01-02 16:00:00', '2022-01-02 18:00:00');
    await createGraphs(4, '2022-01-02 16:00:00', '2022-01-02 18:00:00');
})();