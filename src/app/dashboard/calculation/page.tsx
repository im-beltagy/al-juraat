// ----------------------------------------------------------------------

import { fetchAllVariables } from 'src/actions/variables-actions';
import {
  fetchMedicines,
  fetchMedicineFormulasAndIndications,
  fetchInitialDosage,
} from 'src/actions/calculations-actions';

import CalculationView from 'src/sections/calculation/view/calculation-view';

export const metadata = {
  title: 'Calculations | Al-Juraat Al-Tibbiya',
};

const convertIntoItems = (data: { id: string; name: string }[]) =>
  data?.map((item) => ({
    id: item.id,
    name: item.name,
    name_ar: item.name,
    name_en: item.name,
  }));

type SearchParams = {
  [key in 'medicine' | 'formula' | 'indication']: string | string[] | undefined;
};

export default async function OverviewAppPage({ searchParams }: { searchParams: SearchParams }) {
  const medicine = typeof searchParams.medicine === 'string' ? searchParams.medicine : undefined;
  const formula = typeof searchParams.formula === 'string' ? searchParams.formula : undefined;
  const indication =
    typeof searchParams.indication === 'string' ? searchParams.indication : undefined;

  const medicines = await fetchMedicines();
  const variables = await fetchAllVariables();

  let formulas;
  let indications;

  if (medicine) {
    const res = await fetchMedicineFormulasAndIndications({ id: medicine });
    formulas = res?.data?.formulas;
    indications = res?.data?.indications;
  }

  let initialDosage;

  if (medicine && formula && indication) {
    const res = await fetchInitialDosage({ medicine, formula, indication });
    initialDosage = res?.data;
  }

  return (
    <CalculationView
      medicines={convertIntoItems(medicines?.data || [])}
      variables={variables?.data || []}
      formulas={formulas ? convertIntoItems(formulas) : undefined}
      indications={indications ? convertIntoItems(indications) : undefined}
      initialDosage={initialDosage}
    />
  );
}
