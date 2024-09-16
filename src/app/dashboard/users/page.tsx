import { fetchUsers } from 'src/actions/users-actions';

import UsersView from 'src/sections/users/users-view';

import { IUser } from 'src/types/users';

type SearchParams = {
  [key in 'page' | 'limit']: string | string[] | undefined;
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const page =
    typeof searchParams.page === 'number' ? Number(searchParams.page) : 1  ;
  const limit =
    typeof searchParams.limit === 'number' ? Number(searchParams.limit) : 5;

  const users = await fetchUsers( page, limit );

  return (
    <UsersView users={(users?.items || []) as unknown as IUser[]} count={Number(users?.totalCount)} />
  );
}
