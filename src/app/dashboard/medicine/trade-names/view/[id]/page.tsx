import { fetchSingleTradeName } from 'src/actions/tradeNames-actions';

import SingleTradeNameView from 'src/sections/medicine/view/single-trade-names';

import { TradeNames } from 'src/types/medicine';

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const tradeName = await fetchSingleTradeName(id );

  return <SingleTradeNameView tradeName={tradeName as  TradeNames} />;
}
