import { fetchSingleArticle } from 'src/actions/articles-actions';

import SingleArticleView from 'src/sections/articles/single-view';

import { Article } from 'src/types/articles';

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const article = await fetchSingleArticle(id);

  return <SingleArticleView article={article as unknown as Article} />;
}
