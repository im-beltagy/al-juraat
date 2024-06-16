'use server';

export type Variable = {
  id: string;
  name: string;
  type: 'list' | 'range';
  value?: string;
};
