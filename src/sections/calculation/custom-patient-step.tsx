import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useCallback } from 'react';

import { Stack } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';
import { Grid, Checkbox, TextField } from '@mui/material';

import { useTranslate } from 'src/locales';

import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';
import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field-form';

import { IDosageItem, ICalculationResult, ICalculationResultItem } from 'src/types/calculations';

import { useCalculationStore } from './calculation-store';

const TABLE_HEAD = [
  { id: 'select', label: '' },
  { id: 'variable', label: 'Variable' },
  { id: 'value', label: 'Value' },
  { id: 'newDose', label: 'New Dose' },
];

export interface Props {
  initialDosage?: IDosageItem;
  results: ICalculationResult;
}

export default function CustomPatientStep({ initialDosage, results }: Props) {
  const { t } = useTranslate();

  const { medicine, formula, indication } = useCalculationStore((state) => ({
    medicine: state.medicine,
    formula: state.formula,
    indication: state.indication,
  }));

  const methods = useForm();

  const { handleSubmit } = methods;

  const onSubmit = useCallback((data: any) => {}, []);

  const table = useTable();

  const [choosenResults, setChoosenResults] = useState<{ [key: string]: string | undefined }>({});

  const additionalTableProps = useMemo(
    () => ({
      onRendervalue: (item: ICalculationResultItem) => {
        if (typeof item.value === 'string') {
          return item.value;
        }
        return `${t('from')} ${item.value[0]} ${t('to')} ${item.value[1]}`;
      },
      onRenderselect: (item: ICalculationResultItem) => (
        <Checkbox
          checked={choosenResults[item.variable] === item.id}
          onChange={(e, val) => {
            setChoosenResults((prev) => ({ ...prev, [item.variable]: val ? item.id : undefined }));
          }}
        />
      ),
    }),
    [choosenResults, t]
  );

  // Handle Save
  const [newDosage, setNewDosage] = useState('');
  const [description, setDescription] = useState('');
  const choosenIds = useMemo(
    () => Object.values(choosenResults).filter((id) => id),
    [choosenResults]
  );
  const isDisabled = useMemo(
    () => choosenIds.length < 2 || !newDosage || !description,
    [choosenIds.length, description, newDosage]
  );
  const [isLoading, setIsLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleSave = useCallback(() => {
    setIsLoading(true);
    (async () => {
      try {
        console.log(newDosage, description, choosenIds);
        enqueueSnackbar(t('Successfully saved'), { variant: 'success' });
      } catch (error) {
        enqueueSnackbar(t('Failed to save'), { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [choosenIds, description, enqueueSnackbar, newDosage, t]);

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
              InputProps={{ endAdornment: initialDosage?.dosage }}
              disabled
            />
          </Grid>
        </Grid>
      </FormProvider>

      <Stack
        direction="row"
        spacing={1}
        my={3}
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <TextField
            label={t('New Dosage')}
            placeholder={t('New Dosage')}
            type="number"
            onChange={(e) => setNewDosage(e.target.value)}
          />
          <TextField
            multiline
            rows={3}
            fullWidth
            label={t('Description')}
            placeholder={t('Description')}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Stack>
        <LoadingButton
          variant="contained"
          color="primary"
          loading={isLoading}
          disabled={isDisabled}
          onClick={() => handleSave()}
        >
          {t('Save')}
        </LoadingButton>
      </Stack>

      <SharedTable
        dataFiltered={results.data.items}
        table={table}
        count={results.count}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        disablePagination
        showFromClients
      />
    </>
  );
}
