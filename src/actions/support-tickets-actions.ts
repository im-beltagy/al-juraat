'use server';

import { cookies } from 'next/headers';

import { getErrorMessage } from 'src/utils/axios';

export async function fetchSupportTickets({
  page = 1,
  limit = 5,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: Array.from({ length: 3 }).map((_, index) => ({
        id: index + 1,
        title: `Ticket ${index + 1}`,
        user_name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        phone: '1234567890',
        subject: `Subject ${index + 1}`,
      })),
      meta: {
        itemCount: 3,
      },
    };
    return { data: res?.data, count: res?.meta?.itemCount };
  } catch (error) {
    throw Error(getErrorMessage(error));
  }
}

export async function fetchSingleSupportTicket({ id: index }: { id: string }) {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: {
        title: `Ticket ${index}`,
        user_name: `User ${index}`,
        email: `user${index}@example.com`,
        phone: '1234567890',
        subject: `Subject ${index}`,
      },
    };
    return res;
  } catch (error) {
    throw Error(getErrorMessage(error));
  }
}
