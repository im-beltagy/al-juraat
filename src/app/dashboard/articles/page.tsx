import { fetchArticles } from 'src/actions/articles-actions';

import ArticlesView from 'src/sections/articles/view';

import { Article } from 'src/types/articles';

type SearchParams = {
  [key in 'page' | 'limit'| 'search']: string | string[] | undefined;
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const page =
    typeof searchParams.page === 'string' ? Number(searchParams.page) : 1  ;
  const limit =
    typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 5;
    const search = typeof searchParams.search === 'string' ? searchParams.search : '';

  const articles = await fetchArticles( page, limit ,search);

  return (
    <ArticlesView articles={articles?.items as Article[]} count={Number(articles?.totalCount)} />
  );
}
