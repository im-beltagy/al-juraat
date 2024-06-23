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
