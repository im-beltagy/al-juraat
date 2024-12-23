import { fetchMedicines } from 'src/actions/medicine';

import MedicineView from 'src/sections/medicine/view/medicine-view';

import { Medicine } from 'src/types/medicine';

export const metadata = {
  title: 'Medicine | Al-Juraat Al-Tibbiya',
};

type SearchParams = {
  [key in 'scientific_name' | 'formula' | 'indication' | 'pharmacological_group' | 'page' | 'limit']:
    | string
    | string[]
    | undefined;
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const scientific_name = typeof searchParams.scientific_name === 'string' ? searchParams.scientific_name : undefined;
  const formula = typeof searchParams.formula === 'string' ? searchParams.formula : undefined;
  const indication =
    typeof searchParams.indication === 'string' ? searchParams.indication : undefined;
  const pharmacological_group = typeof searchParams.pharmacological_group === 'string' ? searchParams.pharmacological_group : undefined;
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const limit = typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 5;

  const medicines = await fetchMedicines( page, limit, scientific_name || '', formula || '', indication || '',pharmacological_group || '');

  return (
    <MedicineView
      medicines={medicines?.items as  Medicine[]}
      count={medicines.totalCount as number}
    />
  );
}
