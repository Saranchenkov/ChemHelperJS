import React from 'react';
import Yield from './Yield';
import Chart from './Chart';
import FinalTable from './FinalTable';
import FinalChart from './FinalChart';
import PagesManager from '../Others/PagesManager';

export default PagesManager({pages: [
        Yield,
        Chart,
        FinalTable,
        FinalChart
    ]});