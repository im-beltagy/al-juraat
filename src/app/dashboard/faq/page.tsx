import { fetchFAQ } from 'src/actions/faq-actions';

import FAQView from 'src/sections/faq/view/faq-view';

import { FAQItem } from 'src/types/faq';

export default async function Page() {
  const items = await fetchFAQ();

  return <FAQView items={(items?.data || []) as unknown as FAQItem[]} />;
}
