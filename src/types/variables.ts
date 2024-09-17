'use server';

export type Variable = {
  id: string;
  name: string;
} & (
  | {
      type: 'list';
      value: string;
    }
  | {
      type: 'range';
      max_value: string;
    }
);

export type IVariable =  {
  id: string,
  name: string,
  type: string,
  maxValue: number,
  values: [
    string
  ]
}
