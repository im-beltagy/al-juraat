// ----------------------------------------------------------------------

import { fetchSingleMedicine } from 'src/actions/medicine';
import {
  fetchDosage,
  fetchFormulas,
  fetchVariables,
  fetchIndications,
  fetchScientificNames,
  fetchDominalVariables,
} from 'src/actions/equation-actions';

import CalculationView from 'src/sections/calculation/view/calculation-view';

import { IVariable } from 'src/types/variables';

export const metadata = {
  title: 'Calculations | Al-Juraat Al-Tibbiya',
};

type SearchParams = {
  [key in 'medicine' | 'formula' | 'indication' | 'step' | 'page' | 'limit' | 'equationId']:
    | string
    | string[]
    | undefined;
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const medicine = typeof searchParams.medicine === 'string' ? searchParams.medicine : undefined;
  const formula = typeof searchParams.formula === 'string' ? searchParams.formula : undefined;
  const indication =
    typeof searchParams.indication === 'string' ? searchParams.indication : undefined;
  const step = typeof searchParams.step === 'string' ? searchParams.step : undefined;
  const equationId =
    typeof searchParams.equationId === 'string' ? searchParams.equationId : undefined;

  const scientific_names = await fetchScientificNames();
  const variables = await fetchVariables();

  let formulas;
  let indications;

  if (medicine) {
    const Formulas_res = await fetchFormulas(medicine);
    const Indications_res = await fetchIndications(medicine);

    formulas = Formulas_res;
    indications = Indications_res;
  }
  let medicineD;
  let initialDosage;
  if (medicine && formula && indication && step === 'dominal-variables') {
    const res = await fetchDosage(medicine, formula, indication);

    initialDosage = res;
    const medicineDetails = await fetchSingleMedicine(res?.medicineId);
    medicineD = medicineDetails;
  }
  let resultsRes: any;
  if (equationId) {
    const res = await fetchDominalVariables(equationId);
    resultsRes = res;
  }
  return (
    <CalculationView
      medicines={scientific_names as string[]}
      variables={variables?.items as IVariable[]}
      formulas={formulas as string[]}
      indications={indications as string[]}
      initialDosage={initialDosage}
      medicineDetails={medicineD}
      results={resultsRes}
    />
  );
}
