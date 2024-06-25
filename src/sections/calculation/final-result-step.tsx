import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';

import { Box } from '@mui/system';
import { Grid, Radio } from '@mui/material';

import { useQueryString } from 'src/hooks/use-queryString';

import { useTranslate } from 'src/locales';

import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';
import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field-form';

import { IDosageItem, ICalculationResult, ICalculationResultItem } from 'src/types/calculations';

import { useCalculationStore } from './calculation-store';

const TABLE_HEAD = [
  { id: 'variable', label: 'Variable' },
  { id: 'value', label: 'Value' },
  { id: 'newDose', label: 'New Dose' },
  { id: 'primary', label: '' },
];

export interface Props {
  initialDosage?: IDosageItem;
  results: ICalculationResult;
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
      onRendervalue: (item: ICalculationResultItem) => {
        if (typeof item.value === 'string') {
          return item.value;
        }
        return `${t('from')} ${item.value[0]} ${t('to')} ${item.value[1]}`;
      },
      onRenderprimary: (item: ICalculationResultItem) =>
        item.id === results.data.primary ? <Radio checked /> : null,
    }),
    [results.data.primary, t]
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
              value={medicine?.name}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField name="formula" label={t('Formula')} value={formula?.name} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="indication"
              label={t('Indication')}
              value={indication?.name}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="dosage"
              label={t('Dosage')}
              type="number"
              value={initialDosage?.value}
              InputProps={{ endAdornment: initialDosage?.unit }}
              disabled
            />
          </Grid>
        </Grid>
      </FormProvider>

      <Box mt={3} />

      <SharedTable
        dataFiltered={results.data.items}
        table={table}
        count={results.count}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        disablePagination
        showFromClients
        enableActions
        actions={[
          {
            label: t('Edit'),
            icon: 'solar:pen-bold',
            onClick: (item: ICalculationResultItem) =>
              createQueryString([
                { name: 'step', value: 'dominal-variables' },
                { name: 'variable', value: item.variable_id },
              ]),
          },
        ]}
      />
    </>
  );
}
