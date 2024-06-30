import { fetchPrivacy } from 'src/actions/privacy-actions';

import PrivacyView from 'src/sections/privacy/view/privacy-view';

export const metadata = {
  title: 'Privacy Policy | Al-Juraat Al-Tibbiya',
};

export default async function Page() {
  const privacy = await fetchPrivacy();

  if ('privacy' in privacy) return <PrivacyView privacy={privacy?.privacy} />;
  return <PrivacyView />;
}
