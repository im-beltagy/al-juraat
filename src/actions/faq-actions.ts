import { cookies } from 'next/headers';

import { getErrorMessage } from 'src/utils/axios';

export async function fetchFAQ() {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: Array.from({ length: 5 }).map((_, index) => ({
        id: index + 1,
        question: `Question ${index + 1}`,
        answer:
          'Donec id justo. Curabitur blandit mollis lacus. Vivamus quis mi. In ut quam vitae odio lacinia tincidunt. In consectetuer turpis ut velit. Donec id justo. Curabitur blandit mollis lacus. Vivamus quis mi. In ut quam vitae odio lacinia tincidunt. In consectetuer turpis ut velit.',
      })),
      meta: {
        itemsCount: 10,
      },
    };

    return { data: res?.data, count: res?.meta.itemsCount };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
