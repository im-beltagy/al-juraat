'use server';

export interface IFinalResult {
  id: string;
  medicine: { name: string; id: string };
  formula: { name: string; id: string };
  indication: { name: string; id: string };
}
