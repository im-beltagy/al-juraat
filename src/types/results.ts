export type Result = {

  id: string;
  scientificName: string;
  formula: string;
  indication: string;
  initialDose: number;
  dominalVariables: [
    {
      id: string;
      variableId: string;
      variableName: string;
      value: string;
      minValue: number;
      maxValue: number;
      effect: number;
      result: number;
      effectType: boolean;
    }
  ]

}
export type TradeName = {
  id: string;
  name: string;
  description: string;
  logo?: string;
};
