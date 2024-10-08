import { fetchUsers } from 'src/actions/users-actions';

import UsersView from 'src/sections/users/users-view';

import { IUser } from 'src/types/users';

type SearchParams = {
  [key in 'page' | 'limit'| 'search']: string | string[] | undefined;
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const page =
    typeof searchParams.page === 'string' ? Number(searchParams.page) : 1  ;
  const limit =
    typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 5;
    const search = typeof searchParams.search === 'string' ? searchParams.search : '';

  const users = await fetchUsers( page, limit ,search);

  return (
    <UsersView users={users?.items as IUser[]} count={Number(users?.totalCount)} />
  );
}
