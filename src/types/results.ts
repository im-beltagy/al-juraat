export type Result = {

  id: string;
  scientificName: string;
  formula: string;
  indication: string;
  initialDose: number;
  dominalVariables: IDominalVariables[]

}

export type IDominalVariables = {

    id: string;
    variableId: string;
    variableName: string;
    type:string;
    value: string;
    minValue: number;
    maxValue: number;
    effect: number;
    result: number;
    effectType: boolean;

}
export type TradeName = {
  id: string;
  name: string;
  description: string;
  logo?: string;
};
