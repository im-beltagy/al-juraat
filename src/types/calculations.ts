import * as yup from 'yup';

export const yupCalculationItem = yup
  .object()
  .shape({
    name: yup.string(),
    id: yup.string(),
  })
  .nullable();

export interface CalculationItem {
  name: string;
  id: string;
}

export interface IVariableItem {
  id: string;
  name: string;
  type: string;
  options?: { id: string; name: string }[];
}

export interface IDosageItem {
  value: number;
  unit: string;
}
