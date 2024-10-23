import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useCallback, useEffect } from 'react';
import * as yup from 'yup';

import { Stack } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';
import { Grid, Checkbox, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';

import { useTranslate } from 'src/locales';

import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';
import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field2';

import { IDosageItem, ICalculationResult, ICalculationResultItem } from 'src/types/calculations';

import { useCalculationStore } from './calculation-store';
import { IDominalVariables, Result } from 'src/types/results';
import { addCustomDosage } from 'src/actions/equation-actions';

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
    medicine: state.medicine || {id:results?.scientificName, value:results?.scientificName},
    formula: state.formula || {id:results?.formula, value:results?.formula},
    indication: state.indication || {id:results?.indication, value:results?.indication},
  }));

  const defaultValues = {
    description:  '',
    n_dosage:  0,
};
const variableSchema =  yup.object().shape({

  description:  yup.string().required(t('Description is required')),
  n_dosage:  yup.number().required(t('Dosage is required')),

});


const methods = useForm({
  resolver: yupResolver(variableSchema ),
  defaultValues,
});
const { handleSubmit,getValues,  reset ,formState: { isSubmitting }, } = methods;


  const table = useTable();

  const [choosenVariables, setChoosenVariables] = useState<IDominalVariables[]>([]);

  const additionalTableProps = useMemo(
    () => ({
      onRendervariableName:(item:IDominalVariables)=> <Typography variant="body2">{item?.variableName}</Typography> ,


      onRendervalue: (item: IDominalVariables) => {
      if (typeof item?.value === 'string') {
        return item?.value;
      }
      return `${t('from')} ${item?.minValue} ${t('to')} ${item?.maxValue}`;
    },


      onRenderselect: (item: IDominalVariables) => (
        <Checkbox

          onChange={(e, val) => {
            const foundIteminList = choosenVariables?.find((i)=> i.id ===item.id);
            const add =val && choosenVariables.splice(choosenVariables.indexOf(item),0,item);
            const deleted =!val && choosenVariables.splice(choosenVariables.indexOf(item),1);
            setCount([...choosenVariables]?.length)
            setChoosenVariables(choosenVariables);
          }}
        />
      ),
    }),
    []
  );
console.log(results)
  // Handle Save
  const [newDosage, setNewDosage] = useState('');
  const [description, setDescription] = useState('');
  const [count, setCount] = useState(choosenVariables?.length)
  const isDisabled =  count> 1 && getValues('n_dosage') && getValues('description')? false : true;

  const [isLoading, setIsLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleSave = useCallback(() => {
    setIsLoading(true);
    (async () => {
      try {
        enqueueSnackbar(t('Successfully saved'), { variant: 'success' });
      } catch (error) {
        enqueueSnackbar(t('Failed to save'), { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [ description, enqueueSnackbar, newDosage, t]);

  const onSubmit = useCallback(
    async(data: any) => {

      const dominalVariablesId = [...choosenVariables]?.map((item)=> {
        return {dominalVariableId:item?.id}
      });
      const formData = {
        "equationId": results?.id,
        "value": data?.n_dosage,
        "description":data?.description,
        "customDosageDominalVariables": dominalVariablesId
      };
      console.log(formData)
        const res = await addCustomDosage(formData);
          if (res?.error) {
            enqueueSnackbar(`${res?.error}`, { variant: 'error' });
          } else {
            enqueueSnackbar(t('Added success!'));
            setChoosenVariables([]);
          }


    },
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
              value={results?.initialDose || initialDosage?.dosage}
              InputProps={{ endAdornment:results?.initialDose|| initialDosage?.dosage }}
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
      >
        <Stack direction="row" spacing={1} alignItems="flex-start">
        <RHFTextField

             name="n_dosage"
             label={t('New Dosage')}
            placeholder={t('New Dosage')} />

         <RHFTextField
          multiline
            rows={3}
            fullWidth
             name="description"
             label={t('Description')}
            placeholder={t('Description')} />


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
