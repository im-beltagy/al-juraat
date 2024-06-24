import { fetchFormulasAndIndications, fetchMedicines } from 'src/actions/calculations-actions';
import { fetchResults } from 'src/actions/results-actions';
import { fetchAllVariables } from 'src/actions/variables-actions';

import ResultsView from 'src/sections/results/view/results-view';

import { IFinalResult } from 'src/types/results';

const convertIntoItems = (data: { id: string; name: string }[]) =>
  data?.map((item) => ({
    id: item.id,
    name: item.name,
    name_ar: item.name,
    name_en: item.name,
  }));

type SearchParams = {
  [key in 'medicine' | 'formula' | 'indication' | 'variable' | 'page' | 'limit']:
    | string
    | string[]
    | undefined;
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const medicine = typeof searchParams.medicine === 'string' ? searchParams.medicine : undefined;
  const formula = typeof searchParams.formula === 'string' ? searchParams.formula : undefined;
  const indication =
    typeof searchParams.indication === 'string' ? searchParams.indication : undefined;
  const variable = typeof searchParams.variable === 'string' ? searchParams.variable : undefined;
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : undefined;
  const limit = typeof searchParams.limit === 'string' ? Number(searchParams.limit) : undefined;

  const results = await fetchResults({ medicine, formula, indication, variable, page, limit });

  const medicines = await fetchMedicines();
  const variables = await fetchAllVariables();

  const res = await fetchFormulasAndIndications({});

  return (
    <ResultsView
      results={(results?.data || []) as unknown as IFinalResult[]}
      count={results?.count || 0}
      formulas={convertIntoItems(res?.data?.formulas || [])}
      indications={convertIntoItems(res?.data?.indications || [])}
      medicines={convertIntoItems(medicines?.data || [])}
      variables={convertIntoItems(variables.data || [])}
    />
  );
}
