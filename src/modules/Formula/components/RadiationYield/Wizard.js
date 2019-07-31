import React from 'react';
import FinalTable from './FinalTable';
import FinalChart from './FinalChart';
import PagesManager from 'components/PagesManager';
import { ConcentrationCalculationWays, ReduxForms, Units } from 'utils/utils';
import { finalData, initialData, initialOpticalDensityData } from 'utils/Data';
import { reduxForm } from 'redux-form';
import CalculationWaySelection from '../ConcentrationCalculation/CalculationWaySelection';
import CalibrationTable from '../ConcentrationCalculation/CalibrationTable';
import CalibrationChart from '../ConcentrationCalculation/CalibrationChart';
import OpticalDensityTable from '../ConcentrationCalculation/OpticalDensityTable';
import CalculationWithMAC from '../ConcentrationCalculation/CalculationWithMAC';
import { Wizard } from 'components/Wizard';

// const pageTitle = 'Radiation chemical yield';
// const pageProps = { title: pageTitle, form: ReduxForms.Yield };

// const Wizard = PagesManager({
//   pages: [
//     { component: CalculationWaySelection, props: { ...pageProps } },
//     { component: CalculationWithMAC, props: { ...pageProps } },
//     { component: CalibrationTable, props: { ...pageProps } },
//     { component: CalibrationChart, props: { ...pageProps } },
//     { component: OpticalDensityTable, props: { ...pageProps } },
//     { component: FinalTable },
//     { component: FinalChart },
//   ],
// });
//
// export default reduxForm({
//   form: ReduxForms.Yield,
//   destroyOnUnmount: true,
//   forceUnregisterOnUnmount: true,
//   initialValues: {
//     initialData: initialData,
//     calculationWay: ConcentrationCalculationWays.OWN_WAY,
//
//     opticalDensityData: initialOpticalDensityData,
//     pathLength: 0,
//     MAC: 0,
//
//     finalData: finalData,
//     doseRate: '',
//     solutionDensity: '',
//     unit: Units.moleculesPerHundredVolt,
//   },
// })(Wizard);

const initialValues = {
  initialData: initialData,
  calculationWay: ConcentrationCalculationWays.OWN_WAY,

  opticalDensityData: initialOpticalDensityData,
  pathLength: 0,
  MAC: 0,

  finalData: finalData,
  doseRate: '',
  solutionDensity: '',
  unit: Units.moleculesPerHundredVolt,
};

const components = [
  CalculationWaySelection,
  CalculationWithMAC,
  CalibrationTable,
  CalibrationChart,
  OpticalDensityTable,
  FinalTable,
  FinalChart,
];

function RadiationYieldWizard() {
  return (
    <Wizard
      initialValues={initialValues}
      components={components}
      title="Radiation chemical yield"
    />
  );
}

export default RadiationYieldWizard;
