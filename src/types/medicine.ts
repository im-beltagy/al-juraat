export type Medicine = {
  id: string;
  scientificName: string;
  formula: string;
  indication: string;
  initialDose: number;
  frequency: 1 | 2 | 3 | 4 | 5;
  pharmacologicalGroup: string;
  notes: string;
  preCautions: string;
  sideEffects: string;
  isWeightDependent: boolean;
  tradNames: Array<TradeNames>;
};
export type TradeNames = {
  id: string;
  tradeNamesImages: TardeNamesImages[];
  name: string;
  description: string;
};

export type TardeNamesImages = {
  id: string;
  tradeNameId: string;
  imageUrl: string;
};
