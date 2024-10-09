import { fetchSingleMedicine } from 'src/actions/medicine';

import SingleMedicineView from 'src/sections/medicine/view/medicine-single-view';

import { Medicine } from 'src/types/medicine';

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const medicine = await fetchSingleMedicine(id);

  return <SingleMedicineView medicine={medicine as  Medicine} />;
}
