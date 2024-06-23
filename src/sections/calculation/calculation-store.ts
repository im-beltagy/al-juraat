import { create, StateCreator } from 'zustand';

import { IDosageItem, IVariableItem, CalculationItem } from 'src/types/calculations';

interface MedicineSlice {
  medicine?: CalculationItem;
  setMedicine: (newVal?: CalculationItem) => void;

  formula?: CalculationItem;
  setFormula: (newVal?: CalculationItem) => void;

  indication?: CalculationItem;
  setIndication: (newVal?: CalculationItem) => void;

  variable?: IVariableItem;
  setVariable: (newVal?: IVariableItem) => void;

  initialDosage?: IDosageItem;
  setInitialDosage: (newVal?: IDosageItem) => void;
}

const createMedicineSlice: StateCreator<MedicineSlice, [], [], MedicineSlice> = (set) => ({
  setMedicine: (newVal) => set((state) => ({ medicine: newVal })),
  setFormula: (newVal) => set((state) => ({ formula: newVal })),
  setIndication: (newVal) => set((state) => ({ indication: newVal })),
  setVariable: (newVal) => set((state) => ({ variable: newVal })),
  setInitialDosage: (newVal) => set((state) => ({ initialDosage: newVal })),
});

export const useCalculationStore = create<MedicineSlice>()((...set) => ({
  ...createMedicineSlice(...set),
}));
