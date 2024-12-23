import { fetchPrivacy } from 'src/actions/pages-actions';

import PrivacyView from 'src/sections/privacy/view/privacy-view';

import { Slug } from 'src/types/pages';

export const metadata = {
  title: 'Privacy Policy | Al-Juraat Al-Tibbiya',
};

export default async function Page() {
  const privacy = await fetchPrivacy();

   return <PrivacyView privacy={privacy as  Slug} />;
}
