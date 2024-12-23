import { useForm } from 'react-hook-form';
import { useMemo, useEffect, useCallback } from 'react';

import { Box } from '@mui/system';
import { Grid, Radio, Typography, InputAdornment } from '@mui/material';

import { useQueryString } from 'src/hooks/use-queryString';

import { useTranslate } from 'src/locales';

import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';
import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field-form';

import { IDosageItem } from 'src/types/calculations';
import { IEquationVariable } from 'src/types/variables';
import { Result, IDominalVariables } from 'src/types/results';

import { useCalculationStore } from './calculation-store';

const TABLE_HEAD = [
  { id: 'variableName', label: 'Variable' },
  { id: 'value', label: 'Value' },
  { id: 'result', label: 'New Dose' },
  { id: 'primary', label: '' },
];

export interface Props {
  initialDosage?: IDosageItem;
  results: Result;
}

export default function FinalResultStep({ initialDosage, results }: Props) {
  const { t } = useTranslate();
  const {
    medicine,
    formula,
    indication,
    initialDosage: storeDosage,
    setMedicine,
    setFormula,
    setIndication,
    setEquationVariable,
    setInitialDosage,
  } = useCalculationStore();
  const { createQueryString } = useQueryString();

  const methods = useForm();

  const { handleSubmit } = methods;

  const onSubmit = useCallback((data: any) => {}, []);

  const table = useTable();

  const additionalTableProps = useMemo(
    () => ({
      onRendervariableName: (item: IDominalVariables) => (
        <Typography variant="body2">{item?.variableName}</Typography>
      ),

      onRendervalue: (item: IDominalVariables) => {
        if (typeof item?.value === 'string') {
          return item?.value;
        }
        return `${t('from')} ${item?.minValue} ${t('to')} ${item?.maxValue}`;
      },
      onRenderprimary: (item: IDominalVariables) =>
        results?.dominalVariables?.[0]?.id === item?.id ? <Radio checked /> : null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    setMedicine({ id: results?.scientificName, value: results?.scientificName });
    setFormula({ id: results?.formula, value: results?.formula });
    setIndication({ id: results?.indication, value: results?.indication });

    createQueryString([
      {
        name: 'medicine',
        value: results?.scientificName,
      },
      {
        name: 'formula',
        value: results?.formula,
      },
      {
        name: 'indication',
        value: results?.indication,
      },
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results?.id]);
  useEffect(() => {
    setInitialDosage(initialDosage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDosage]);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Static Details */}
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="medicine"
              label={t('Scientific name')}
              value={medicine?.value}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField name="formula" label={t('Formula')} value={formula?.value} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="indication"
              label={t('Indication')}
              value={indication?.value}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="dosage"
              label={t('Dosage')}
              type="number"
              value={storeDosage?.dosage}
              InputProps={{
                endAdornment: storeDosage?.isWeightDependent ? (
                  <InputAdornment position="end">mg/kg</InputAdornment>
                ) : (
                  <InputAdornment position="end">mg</InputAdornment>
                ),
              }}
              disabled
            />
          </Grid>
        </Grid>
      </FormProvider>

      <Box mt={3} />
      <SharedTable
        dataFiltered={results?.dominalVariables || []}
        table={table}
        count={results?.dominalVariables?.length || 0}
        disablePagination
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        enableActions
        actions={[
          {
            label: t('Edit'),
            icon: 'solar:pen-bold',
            onClick: (item: IEquationVariable) => {
              createQueryString([{ name: 'step', value: 'dominal-variables' }]);
              setEquationVariable(item);
            },
          },
        ]}
      />
    </>
  );
}
