import { fetchPrivacy } from 'src/actions/privacy-actions';

import PrivacyView from 'src/sections/privacy/view/privacy-view';

export const metadata = {
  title: 'Privacy Policy | Al-Juraat Al-Tibbiya',
};

export default async function Page() {
  const privacy = await fetchPrivacy();

  if ('privacy_ar' in privacy && 'privacy_en' in privacy)
    return <PrivacyView privacy_ar={privacy?.privacy_ar} privacy_en={privacy?.privacy_en} />;
  return <PrivacyView />;
}
