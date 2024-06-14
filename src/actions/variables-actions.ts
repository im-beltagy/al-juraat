'use server';

import { cookies } from 'next/headers';

import { getErrorMessage } from 'src/utils/axios';

export async function fetchVariables({ page = 1, limit = 5 }: { page?: number; limit?: number }) {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: [
        {
          name: 'Gender',
          type: 'LIST',
          value: 'Male',
        },
        {
          name: 'Gender',
          type: 'LIST',
          value: 'Female',
        },
        {
          name: 'Age',
          type: 'RANGE',
        },
      ],
      meta: {
        itemCount: 3,
      },
    };
    return { data: res?.data, count: res?.meta?.itemCount };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
