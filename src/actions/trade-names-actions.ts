'use server';

import { cookies } from 'next/headers';

import { getErrorMessage } from 'src/utils/axios';

export async function fetchTradeNames({
  id,
  page = 1,
  limit = 5,
}: {
  id: string;
  page?: number;
  limit?: number;
}) {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: {
        medicine: 'Congestal',
        formula: 'Tabs',
        indication: 'Headache',

        trade_names: Array.from({ length: 5 }).map((_, index) => ({
          id: index + 1,
          name: `Trade Name ${index + 1}`,
          description: `Trade Name Description ${index + 1}`,
        })),
      },
      meta: {
        itemCount: 10,
      },
    };
    return { data: res?.data, count: res?.meta?.itemCount };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}

export async function fetchSingleTradeName({ id }: { id: string }) {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      logo: 'data:image/png;base64,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',
      name: 'Trade Name',
      description: 'Trade Name Description',
    };
    return res;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
