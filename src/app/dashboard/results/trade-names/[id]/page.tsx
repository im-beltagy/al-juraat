import { fetchTradeNames } from 'src/actions/trade-names-actions';

import TradeNamesView from 'src/sections/results/view/trade-names-view';

import { TradeName } from 'src/types/results';

type SearchParams = {
  [key in 'page' | 'limit']: string | string[] | undefined;
};

export default async function Page({
  searchParams,
  params: { id },
}: {
  searchParams: SearchParams;
  params: { id: string };
}) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : undefined;
  const limit = typeof searchParams.limit === 'string' ? Number(searchParams.limit) : undefined;

  const tradeNames = await fetchTradeNames({ id, page, limit });

  return (
    <TradeNamesView
      medicine={tradeNames?.data?.medicine || ''}
      formula={tradeNames?.data?.formula || ''}
      indication={tradeNames?.data?.indication || ''}
      tradeNames={(tradeNames?.data?.trade_names || []) as unknown as TradeName[]}
      count={Number(tradeNames?.count)}
    />
  );
}
