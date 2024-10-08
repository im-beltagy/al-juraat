export type Medicine = {
  id: string;
  scientificName: string;
  formula: string;
  indication: string;
  initialDose: number;
  pharmacologicalGroup: string;
  notes: string;
  preCautions: string;
  sideEffects: string;
  tradNames: Array<any>;
}
