import { fetchPackages } from 'src/actions/packages-actions';

import PackagesView from 'src/sections/packages/view/packages-view';

import { Package } from 'src/types/packages';

type SearchParams = {
  [key in 'page' | 'limit']: string | string[] | undefined;
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const page =
    typeof searchParams.page === 'string' ? Number(searchParams.page) || undefined : undefined;
  const limit =
    typeof searchParams.limit === 'string' ? Number(searchParams.limit) || undefined : undefined;

  const packages = await fetchPackages({ page, limit });

  return (
    <PackagesView
      packages={packages?.data as unknown as Package[]}
      count={packages.count as number}
    />
  );
}
