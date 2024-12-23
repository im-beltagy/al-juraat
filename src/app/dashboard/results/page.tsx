import { fetchResults } from 'src/actions/results-actions';

import ResultsView from 'src/sections/results/view/results-view';

import { Result } from 'src/types/results';

export const metadata = {
  title: 'Results | Al-Juraat Al-Tibbiya',
};

type SearchParams = {
  [key in 'scientific_name' | 'formula' | 'indication' | 'page' | 'limit']:
    | string
    | string[]
    | undefined;
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const scientific_name =
    typeof searchParams.scientific_name === 'string' ? searchParams.scientific_name : undefined;
  const formula = typeof searchParams.formula === 'string' ? searchParams.formula : undefined;
  const indication =
    typeof searchParams.indication === 'string' ? searchParams.indication : undefined;
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const limit = typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 5;

  const results = await fetchResults(
    page,
    limit,
    scientific_name || '',
    formula || '',
    indication || ''
  );

  return <ResultsView results={results?.items as Result[]} count={results.totalCount as number} />;
}
