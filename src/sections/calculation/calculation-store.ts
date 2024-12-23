import { create, StateCreator } from 'zustand';

import { IDosageItem } from 'src/types/calculations';
import { IVariable, IEquationVariable } from 'src/types/variables';

interface MedicineSlice {
  medicine?: { id: string; value: string };
  setMedicine: (newVal?: { id: string; value: string }) => void;

  formula?: { id: string; value: string };
  setFormula: (newVal?: { id: string; value: string }) => void;

  indication?: { id: string; value: string };
  setIndication: (newVal?: { id: string; value: string }) => void;

  variable?: IVariable;
  setVariable: (newVal?: IVariable) => void;

  allVariables?: IVariable[];
  setAllVariables: (newVal?: IVariable[]) => void;

  equationVariable?: IEquationVariable;
  setEquationVariable: (newVal?: IEquationVariable) => void;

  initialDosage?: IDosageItem;
  setInitialDosage: (newVal?: IDosageItem) => void;
}

const createMedicineSlice: StateCreator<MedicineSlice, [], [], MedicineSlice> = (set) => ({
  setMedicine: (newVal) => set((state) => ({ medicine: newVal })),
  setFormula: (newVal) => set((state) => ({ formula: newVal })),
  setIndication: (newVal) => set((state) => ({ indication: newVal })),
  setVariable: (newVal) => set((state) => ({ variable: newVal })),
  setEquationVariable: (newVal) => set((state) => ({ equationVariable: newVal })),
  setInitialDosage: (newVal) => set((state) => ({ initialDosage: newVal })),
  setAllVariables: (newVal) => set((state) => ({ allVariables: newVal })),
});

export const useCalculationStore = create<MedicineSlice>()((...set) => ({
  ...createMedicineSlice(...set),
}));
