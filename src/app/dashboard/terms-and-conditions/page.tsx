import { fetchTerms } from 'src/actions/pages-actions';

import TermsAndConditionsView from 'src/sections/terms/view/termsAndConditions';

import { Slug } from 'src/types/pages';

export const metadata = {
  title: 'Terms and conditions| Al-Juraat Al-Tibbiya',
};

export default async function Page() {
  const terms = await fetchTerms();

  if (terms) return <TermsAndConditionsView terms={terms as Slug} />;
  return <TermsAndConditionsView />;
}
