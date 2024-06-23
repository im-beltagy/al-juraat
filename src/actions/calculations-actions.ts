import { cookies } from 'next/headers';

import { getErrorMessage } from 'src/utils/axios';

export async function fetchMedicines() {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: [
        {
          id: 'name1',
          name: 'Medicine 1',
        },
        {
          id: 'name2',
          name: 'Medicine 2',
        },
        {
          id: 'name3',
          name: 'Medicine 3',
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

export async function fetchMedicineFormulasAndIndications({ id }: { id: string }) {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: {
        formulas: [
          {
            id: 'formula1',
            name: 'Formula 1',
          },
          {
            id: 'formula2',
            name: 'Formula 2',
          },
          {
            id: 'formula3',
            name: 'Formula 3',
          },
        ],
        indications: [
          {
            id: 'indication1',
            name: 'Indication 1',
          },
          {
            id: 'indication2',
            name: 'Indication 2',
          },
          {
            id: 'indication3',
            name: 'Indication 3',
          },
        ],
      },
    };
    return { data: res?.data };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}

export async function fetchInitialDosage({
  medicine,
  formula,
  indication,
}: {
  medicine: string;
  formula: string;
  indication: string;
}) {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: {
        value: 100,
        unit: 'tab',
      },
    };
    return { data: res?.data };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}

export async function fetchCalculationFinalResult({
  medicine,
  formula,
  indication,
}: {
  medicine: string;
  formula: string;
  indication: string;
}) {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: {
        items: [
          {
            id: '1',
            variable: 'Age',
            value: [0, 15],
            newDose: 25,
          },
          {
            id: '2',
            variable: 'Age',
            value: [16, 190],
            newDose: 35,
          },
          {
            id: '3',
            variable: 'Gender',
            value: 'Male',
            newDose: 40,
          },
        ],
        primary: '1',
      },
      meta: {
        itemsCount: 3,
      },
    };
    return { data: res?.data, count: res.meta.itemsCount };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
