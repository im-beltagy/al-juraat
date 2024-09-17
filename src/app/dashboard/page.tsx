import { fetchVariables } from 'src/actions/variables-actions';

import VariablesView from 'src/sections/variables/view/variables-view';

import { IVariable } from 'src/types/variables';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Variables | Al-Juraat Al-Tibbiya',
};

type SearchParams = {
  [key in 'page' | 'limit']: string | string[] | undefined;
};

interface Props {
  searchParams: SearchParams;
}

export default async function OverviewAppPage({ searchParams }: Props) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const limit = typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 5;

  const variables = await fetchVariables( page, limit );

  return (
    <VariablesView variables={variables?.items as IVariable[]} count={Number(variables?.totalCount)} />
  );
}
