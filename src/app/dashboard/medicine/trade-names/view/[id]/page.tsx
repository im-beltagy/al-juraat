import { fetchSingleTradeName } from 'src/actions/trade-names-actions';

import SingleTradeNameView from 'src/sections/results/view/single-trade-name-view';

import { TradeName } from 'src/types/results';

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const tradeName = await fetchSingleTradeName({ id });

  return <SingleTradeNameView tradeName={tradeName as unknown as TradeName} />;
}
