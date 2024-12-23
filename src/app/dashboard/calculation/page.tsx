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
  const equationId =
    typeof searchParams.equationId === 'string' ? searchParams.equationId : undefined;

  const scientifiNames = await fetchScientificNames();
  const variables = await fetchVariables();

  let formulas;
  let indications;
  if (medicine) {
    formulas = await fetchFormulas(medicine);
    indications = await fetchIndications(medicine);
  }

  let medicineDetails;
  let initialDosage;
  if (medicine && formula && indication) {
    const dosage = await fetchDosage(medicine, formula, indication);
    initialDosage = dosage;
    medicineDetails = await fetchSingleMedicine(dosage?.medicineId);
  }

  let results;
  if (equationId) {
    const res = await fetchDominalVariables(equationId);
    results = res;
  }
  return (
    <CalculationView
      medicines={scientifiNames as string[]}
      variables={variables?.items as IVariable[]}
      formulas={formulas as string[]}
      indications={indications as string[]}
      initialDosage={initialDosage}
      medicineDetails={medicineDetails}
      results={results}
    />
  );
}
