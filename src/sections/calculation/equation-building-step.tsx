'use client';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Grid } from '@mui/material';

import { useQueryString } from 'src/hooks/use-queryString';

import { useTranslate } from 'src/locales';

import { RHFAutocomplete } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

import { IVariable } from 'src/types/variables';

import { useCalculationStore } from './calculation-store';

type ITem = { id: string; value: string };
export interface Props {
  medicines: string[];
  formulas?: string[];
  indications?: string[];
  variables: IVariable[];
}

export default function EquationBuildingStep({
  medicines,
  formulas,
  indications,
  variables,
}: Props) {
  const { t } = useTranslate();

  const { createQueryString } = useQueryString();

  const searchParams = useSearchParams();
  const medicine = searchParams.get('medicine');
  const formulaId = searchParams.get('formula');
  const indicationId = searchParams.get('indication');

  const { setMedicine, setFormula, setIndication, setAllVariables, allVariables } =
    useCalculationStore((store) => ({
      setMedicine: store.setMedicine,
      setFormula: store.setFormula,
      setIndication: store.setIndication,
      setAllVariables: store.setAllVariables,
      allVariables: store.allVariables,
    }));

  const { medicineItem, formulaItem, indicationItem } = useMemo(
    () => ({
      // error here if no data back from api
      medicineItem: (medicines && medicines?.find((m) => m === medicine)) || '',
      formulaItem: (formulas && formulas?.find((f) => f === formulaId)) || '',
      indicationItem: (indications && indications?.find((i) => i === indicationId)) || '',
    }),
    [formulaId, formulas, indicationId, indications, medicine, medicines]
  );

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        medicine: yup
          .object({
            id: yup.string(),
            value: yup.string(),
          })
          .nullable(),
        formula: yup
          .object({
            id: yup.string(),
            value: yup.string(),
          })
          .nullable(),
        indication: yup
          .object({
            id: yup.string(),
            value: yup.string(),
          })
          .nullable(),
        variables: yup.array().nullable(),
      })
    ),
    defaultValues: {
      medicine: { id: medicineItem, value: medicineItem },
      formula: { id: formulaItem, value: formulaItem },
      indication: { id: indicationItem, value: indicationItem },
      variables:
        variables
          .filter((v) => allVariables?.some(({ id }) => id === v.id))
          .map((item) => ({ ...item }) as IVariable) || {},
    },
  });

  const choosenVariables = methods.watch('variables');
  const choosenFormula = methods.watch('formula');
  const choosenIndication = methods.watch('indication');
  const choosenMedicine = methods.watch('medicine');
  useEffect(() => {
    sessionStorage.setItem('medicine', JSON.stringify(choosenMedicine));
    sessionStorage.setItem('formula', JSON.stringify(choosenFormula));
    sessionStorage.setItem('indication', JSON.stringify(choosenIndication));
    sessionStorage.setItem('selectedVariables', JSON.stringify(choosenVariables));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosenVariables, choosenMedicine, choosenFormula, choosenFormula]);
  const { setValue } = methods;

  useEffect(() => {
    const refactoredVariables = variables.filter(
      (v) => choosenVariables?.some((item) => item?.id === v.id)
    );
    setAllVariables(refactoredVariables.length > 0 ? refactoredVariables : undefined);
  }, [choosenVariables, setAllVariables, variables]);

  useEffect(() => {
    if (medicineItem) {
      setMedicine({ id: medicineItem || '', value: medicineItem || '' });
    }
    if (formulaItem) {
      setFormula({ id: formulaItem || '', value: formulaItem || '' });
    }
    if (indicationItem) {
      setIndication({ id: indicationItem || '', value: indicationItem || '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <FormProvider methods={methods}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <RHFAutocomplete
              name="medicine"
              label={t('Scientific name')}
              placeholder={t('Scientific name')}
              options={medicines?.map((item) => ({ id: item, value: item }))}
              getOptionLabel={(option) => {
                if (typeof option !== 'string') {
                  return option.id;
                }
                return '';
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_event, newValue: any) => {
                if (newValue) {
                  setValue('medicine', newValue as any);
                  createQueryString([{ name: 'medicine', value: String(newValue.id) }]);
                  setMedicine(newValue as any);
                } else {
                  setMedicine();
                  setFormula();
                  setValue('formula', null);
                  setValue('indication', null);
                  setValue('medicine', null);
                  setIndication();
                  createQueryString([{ name: 'medicine' }]);
                  createQueryString([{ name: 'formula' }]);
                  createQueryString([{ name: 'indication' }]);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFAutocomplete
              name="formula"
              label={t('Formula')}
              placeholder={t('Formula')}
              options={formulas?.map((item) => ({ id: item, value: item }) as ITem) || []}
              getOptionLabel={(option) => {
                if (typeof option !== 'string') {
                  return option.id;
                }
                return '';
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_event, newValue: any) => {
                if (newValue) {
                  setValue('formula', newValue);

                  createQueryString([{ name: 'formula', value: String(newValue.id) }]);

                  setFormula(newValue);
                } else {
                  setValue('formula', null);
                  setFormula();
                  createQueryString([{ name: 'formula' }]);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFAutocomplete
              name="indication"
              label={t('Indication')}
              placeholder={t('Indication')}
              options={indications?.map((item) => ({ id: item, value: item }) as ITem) || []}
              getOptionLabel={(option) => {
                if (typeof option !== 'string') {
                  return option.id;
                }
                return '';
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_event, newValue: any) => {
                if (newValue) {
                  setValue('indication', newValue);
                  setIndication(newValue);
                  createQueryString([{ name: 'indication', value: String(newValue.id) }]);
                } else {
                  setValue('indication', null);
                  setIndication();
                  createQueryString([{ name: 'indication' }]);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFAutocomplete
              name="variables"
              label={t('Variables')}
              placeholder={t('Choose one or more variable')}
              multiple
              options={variables.map((item) => ({ ...item }) as IVariable)}
              getOptionLabel={(option) => {
                if (typeof option !== 'string') {
                  return option.name;
                }
                return '';
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              filterSelectedOptions
              ChipProps={{
                variant: 'soft',
                color: 'info',
                sx: {
                  letterSpacing: 1,
                },
              }}
            />
          </Grid>
        </Grid>
      </FormProvider>
      <Box />
    </>
  );
}
