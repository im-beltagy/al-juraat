'use server';

import { cookies } from 'next/headers';

import { getErrorMessage } from 'src/utils/axios';

export async function fetchUsers({ page = 1, limit = 5 }: { page?: number; limit?: number }) {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: Array.from({ length: 5 }).map((_, index) => ({
        id: index + 1,
        name: `User ${index + 1}`,
        phone: '1234567890',
        medical_id: '3032',
        medical_id_photo: '',
        created_at: new Date().toISOString(),
        email: `user${index + 1}@example.com`,
        package_name: 'Monthly',
      })),
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

export async function fetchSingleUser({ id }: { id: string }) {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: {
        name: 'User 1',
        phone: '1234567890',
        medical_id: '3032',
        medical_id_photo:
          'data:image/jpeg;base64,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',
        created_at: '2022-01-01T00:00:00.000Z',
        email: 'jGk6k@example.com',
        package_name: 'Monthly',
      },
    };
    return res;
  } catch (error) {
    throw Error(error);
  }
}
