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
