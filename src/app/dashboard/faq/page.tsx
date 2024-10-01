import { fetchFQA } from 'src/actions/faq-actions';

import FAQView from 'src/sections/faq/view/faq-view';

import { FAQItem } from 'src/types/faq';

export default async function Page() {
  const questions = await fetchFQA();

  return <FAQView items={(questions?.items || []) as unknown as FAQItem[]} />;
}
