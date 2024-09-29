import { fetchSingleArticle } from 'src/actions/articles-actions';

import EditArticleView from 'src/sections/articles/edit-article';

import { Article } from 'src/types/articles';

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const article = await fetchSingleArticle(id);

  return <EditArticleView article={article as unknown as Article} />;
}
