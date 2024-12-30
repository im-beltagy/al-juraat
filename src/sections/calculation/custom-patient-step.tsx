import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useCallback } from 'react';

import { Stack } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';
import { Grid, Checkbox, MenuItem, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';
import { addCustomDosage } from 'src/actions/equation-actions';

import { useTable } from 'src/components/table';
import { RHFSelect } from 'src/components/hook-form';
import SharedTable from 'src/components/shared-table';
import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field2';

import { IDosageItem } from 'src/types/calculations';
import { Result, IDominalVariables } from 'src/types/results';

import { frequency } from '../medicine/medicine-dialog';
import { useCalculationStore } from './calculation-store';

const TABLE_HEAD = [
  { id: 'select', label: '' },
  { id: 'variableName', label: 'Variable' },
  { id: 'value', label: 'Value' },
  { id: 'result', label: 'New Dose' },
];

export interface Props {
  initialDosage?: IDosageItem;
  results: Result;
}

export default function CustomPatientStep({ initialDosage, results }: Props) {
  const { t } = useTranslate();

  const { medicine, formula, indication } = useCalculationStore((state) => ({
    medicine: state.medicine || { id: results?.scientificName, value: results?.scientificName },
    formula: state.formula || { id: results?.formula, value: results?.formula },
    indication: state.indication || { id: results?.indication, value: results?.indication },
  }));

  const defaultValues = {
    description: '',
    n_dosage: 0,
    frequency: undefined as unknown as 1,
  };
  const variableSchema = yup.object().shape({
    description: yup.string().required(t('Description is required')),
    n_dosage: yup.number().required(t('Dosage is required')),
    frequency: yup.mixed<1 | 2 | 3 | 4 | 5>().required(t('Frequency is required')),
  });

  const methods = useForm({
    resolver: yupResolver(variableSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const table = useTable();

  const [choosenVariables, setChoosenVariables] = useState<IDominalVariables[]>([]);

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

      onRenderselect: (item: IDominalVariables) => (
        <Checkbox
          onChange={(e, val) => {
            setChoosenVariables(choosenVariables);
          }}
        />
      ),
    }),
    [choosenVariables, t]
  );

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = useCallback(
    async (data: any) => {
      const dominalVariablesId = [...choosenVariables]?.map((item) => ({
        dominalVariableId: item?.id,
      }));
      const formData = {
        equationId: results?.id,
        value: data?.n_dosage,
        description: data?.description,
        customDosageDominalVariables: dominalVariablesId,
      };
      console.log(formData);
      const res = await addCustomDosage(formData);
      if (res?.error) {
        enqueueSnackbar(`${res?.error}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Added success!'));
        setChoosenVariables([]);
      }
    },
    [choosenVariables, enqueueSnackbar, results?.id, t]
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
              value={results?.initialDose || initialDosage?.dosage}
              InputProps={{ endAdornment: results?.initialDose || initialDosage?.dosage }}
              disabled
            />
          </Grid>
        </Grid>

        <Stack
          direction="row"
          spacing={1}
          my={3}
          alignItems="flex-start"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Stack direction="row" spacing={1} alignItems="flex-start" flexWrap="wrap">
            <Stack direction="row" flexGrow={1} maxWidth="25rem">
              <RHFTextField
                name="n_dosage"
                label={t('New Dosage')}
                placeholder={t('New Dosage')}
                sx={{
                  '& .MuiInputBase-root': {
                    borderStartEndRadius: 0,
                    borderEndEndRadius: 0,
                    height: '100%',
                  },
                }}
              />

              <RHFSelect
                name="frequency"
                label={t('Frequency')}
                placeholder={t('Frequency')}
                sx={{
                  '& .MuiInputBase-root': { borderStartStartRadius: 0, borderEndStartRadius: 0 },
                }}
              >
                {frequency.map((item: { value: number; label: string }, index: number) => (
                  <MenuItem key={index} value={item?.value}>
                    {item?.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>

            <RHFTextField
              multiline
              rows={3}
              fullWidth
              name="description"
              label={t('Description')}
              placeholder={t('Description')}
            />
          </Stack>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            {t('Save')}
          </LoadingButton>
        </Stack>
      </FormProvider>

      <SharedTable
        dataFiltered={results?.dominalVariables || []}
        table={table}
        count={results?.dominalVariables?.length || 0}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        disablePagination
        showFromClients
      />
    </>
  );
}

/* {
  "equationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "value": 0,
  "description": "string",
  "customDosageDominalVariables": [
    {
      "dominalVariableId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    }
  ]
} */
