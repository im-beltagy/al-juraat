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
          type: 'list',
          value: 'Male',
        },
        {
          name: 'Gender',
          type: 'list',
          value: 'Female',
        },
        {
          name: 'Age',
          type: 'range',
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

export async function fetchAllVariables() {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: [
        {
          name: 'Gender',
          id: 'gender',
          type: 'list',
          options: [
            { id: 'male', name: 'Male' },
            { id: 'female', name: 'Female' },
          ],
        },
        {
          name: 'Age',
          id: 'age',
          type: 'range',
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
