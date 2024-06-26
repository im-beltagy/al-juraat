import { cookies } from 'next/headers';

import { getErrorMessage } from 'src/utils/axios';

export async function fetchPrivacy() {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: {
        privacy_ar: 'صفحه سياسه الخصوصيه الخاصه بتطبيق الجرعات الطبيرة',
        privacy_en: 'Privacy Policy Page of the Al-Juraat App',
      },
    };

    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
