import { fetchAllPackages } from 'src/actions/packages-actions';

import PackagesView from 'src/sections/packages/view/packages-view';

import { Package } from 'src/types/packages';

export const metadata = {
  title: 'Packages | Al-Juraat Al-Tibbiya',
};

type SearchParams = {
  [key in 'page' | 'limit' | 'search']: string | string[] | undefined;
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const page =
    typeof searchParams.page === 'string' ? Number(searchParams.page)  : 1;
  const limit =
    typeof searchParams.limit === 'string' ? Number(searchParams.limit)  : 5;
    const search = typeof searchParams.search === 'string' ? searchParams.search : '';

  const packages = await fetchAllPackages( page, limit, search );

  return (
    <PackagesView
      packages={packages?.items as  Package[]}
      count={packages.totalCount as number}
    />
  );
}
