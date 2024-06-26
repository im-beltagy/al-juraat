import { fetchUsers } from 'src/actions/users-actions';

import UsersView from 'src/sections/users/users-view';

import { IUser } from 'src/types/users';

type SearchParams = {
  [key in 'page' | 'limit']: string | string[] | undefined;
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const page =
    typeof searchParams.page === 'string' ? Number(searchParams.page) || undefined : undefined;
  const limit =
    typeof searchParams.limit === 'string' ? Number(searchParams.limit) || undefined : undefined;

  const users = await fetchUsers({ page, limit });

  return (
    <UsersView users={(users?.data || []) as unknown as IUser[]} count={Number(users.count)} />
  );
}
