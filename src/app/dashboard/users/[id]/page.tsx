import { fetchSingleUser } from 'src/actions/users-actions';

import SingleUserView from 'src/sections/users/single-user-view';

import { IUser } from 'src/types/users';

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const user = await fetchSingleUser( id );

  return <SingleUserView user={user as unknown as IUser} />;
}
