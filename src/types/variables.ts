'use server';

export type Variable = {
  id: string;
  name: string;
  type: 'LIST' | 'RANGE';
  value?: string;
};
