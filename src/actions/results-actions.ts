'use server';

import { cookies } from 'next/headers';

import { getErrorMessage } from 'src/utils/axios';

export async function fetchResults({
  page = 1,
  limit = 5,
  medicine,
  formula,
  indication,
  variable,
}: {
  page?: number;
  limit?: number;
  medicine?: string;
  formula?: string;
  indication?: string;
  variable?: string;
}) {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: Array.from({ length: 3 }).map((_, index) => ({
        id: index + 1,
        medicine: { name: `Medicine ${index + 1}`, id: `name${index + 1}` },
        indication: { name: `Indication ${index + 1}`, id: `indication${index + 1}` },
        formula: { name: `Formula ${index + 1}`, id: `formula${index + 1}` },
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
