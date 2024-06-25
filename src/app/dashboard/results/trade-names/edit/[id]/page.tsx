import { fetchSingleTradeName } from 'src/actions/trade-names-actions';

import EditTradeNameView from 'src/sections/results/view/edit-trade-name-view';

import { TradeName } from 'src/types/results';

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const tradeName = await fetchSingleTradeName({ id });

  return <EditTradeNameView tradeName={tradeName as unknown as TradeName} />;
}
