import { fetchTradeNames } from 'src/actions/tradeNames-actions';

import TradeNamesView from 'src/sections/medicine/view/trade-names-view';

import { TradeNames } from 'src/types/medicine';

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
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const limit = typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 5;

  const tradeNames = await fetchTradeNames( id, page, limit );

  return (
    <TradeNamesView
        medicineId={id}
      tradeNames={(tradeNames?.items  || []) as TradeNames[]}
      count={Number(tradeNames?.totalCount)}
    />
  );
}
