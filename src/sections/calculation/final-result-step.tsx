import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';

import { Box } from '@mui/system';
import { Grid, Radio, Typography } from '@mui/material';

import { useQueryString } from 'src/hooks/use-queryString';

import { useTranslate } from 'src/locales';

import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';
import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field-form';

import { IDosageItem, ICalculationResult, ICalculationResultItem } from 'src/types/calculations';

import { useCalculationStore } from './calculation-store';
import { IEquationVariable } from 'src/types/variables';
import { IDominalVariables, Result } from 'src/types/results';

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

  const { medicine, formula, indication } = useCalculationStore((state) => ({
    medicine: state.medicine,
    formula: state.formula,
    indication: state.indication,
  }));
  const { createQueryString } = useQueryString();

  const methods = useForm();

  const { handleSubmit } = methods;

  const onSubmit = useCallback((data: any) => {}, []);

  const table = useTable();

  const additionalTableProps = useMemo(
    () => ({
      onRendervariableName:(item:IDominalVariables)=> <Typography variant="body2">{item?.variableName}</Typography> ,


        onRendervalue: (item: IDominalVariables) => {
        if (typeof item?.value === 'string') {
          return item?.value;
        }
        return `${t('from')} ${item?.minValue} ${t('to')} ${item?.maxValue}`;
      },
      onRenderprimary: (item: IDominalVariables) =>
      results?.dominalVariables?.[0] ? <Radio checked /> : null,
    }),
    []
  );

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
              value={initialDosage?.dosage}
              InputProps={{ endAdornment: 'unit' }}
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
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        disablePagination
        showFromClients
        enableActions
        actions={[
          {
            label: t('Edit'),
            icon: 'solar:pen-bold',
            onClick: (item: IDominalVariables) => {

              createQueryString([
                { name: 'step', value: 'dominal-variables' },
                { name: 'variableId', value: item.variableId },
              ])
            }
          },
        ]}
      />
    </>
  );
}
