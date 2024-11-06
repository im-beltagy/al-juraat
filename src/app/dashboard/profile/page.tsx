import { fetchProfile } from 'src/actions/profile-actions';

import Profile from 'src/sections/profile/view';
import { IProfile } from 'src/types/profile';

export const metadata = {
  title: 'Profile | Al-Juraat Al-Tibbiya',
};

export default async function Page() {
  const getProfile = await fetchProfile();

   return <Profile profile={getProfile as  IProfile} />;
}
