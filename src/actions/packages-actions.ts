'use server';

import { cookies } from 'next/headers';

import { getErrorMessage } from 'src/utils/axios';

export async function fetchPackages({ page = 1, limit = 5 }: { page?: number; limit?: number }) {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: [
        {
          id: '1',
          name: 'Monthly',
          price: 15,
          duration: 30,
        },
        {
          id: '2',
          name: 'Annual',
          price: 180,
          duration: 365,
        },
      ],
      meta: {
        itemCount: 2,
      },
    };
    return { data: res?.data, count: res?.meta?.itemCount };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
