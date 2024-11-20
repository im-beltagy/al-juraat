'use client';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { getValue, Stack, width } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogTitle, DialogActions, InputAdornment, MenuItem } from '@mui/material';

import { useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field2';
import { enqueueSnackbar } from 'notistack';
import { Medicine } from 'src/types/medicine';
import { addMedicine, editMedicine } from 'src/actions/medicine';
import { toFormData } from 'axios';
import { RHFCheckbox, RHFSelect } from 'src/components/hook-form';


const formula_options = [
  {
    value: 0,
    label: 'Oral',
  },
  {
    value: 1,
    label: 'IV',
  },
  {
    value: 2,
    label: 'IM',
  }, {
    value: 3,
    label: 'SC',
  }
  , {
    value: 4,
    label: 'Patch',
  },
  {
    value: 5,
    label: 'Local',
  }
];
interface Props {
  open: boolean;
  onClose: () => void;
  medicine?: Medicine;
}


export default function MedicineDialog({ open, onClose, medicine }: Props) {
  const { t } = useTranslate();
  const defaultValues = {
    ScientificName: medicine?.scientificName || '',
    Formula: medicine?.formula || '',
    Indication: medicine?.indication || '',
    InitialDose: medicine?.initialDose || 0,
    IsWeightDependent: medicine?.isWeightDependent || false,
    PharmacologicalGroup: medicine?.pharmacologicalGroup || '',
    Notes: medicine?.notes || '',
    PreCautions: medicine?.preCautions || '',
    SideEffects: medicine?.sideEffects || '',
  };
  const variableSchema = yup.object().shape({
    ScientificName: yup.string().required(t('ScientificName is required')),
    Formula: yup.mixed().required(t('Formula is required')),
    Indication: yup.string().required(t('Indication is required')),
    InitialDose: yup.number().required(t('InitialDose is required')),
    IsWeightDependent: yup.boolean(),
    PharmacologicalGroup: yup.string().required(t('PharmacologicalGroup is required')),
    Notes: yup.string().required(t('Notes is required')),
    PreCautions: yup.string().required(t('PreCautions is required')),
    SideEffects: yup.string().required(t('SideEffects is required')),

  });


  const methods = useForm({
    resolver: yupResolver(variableSchema),
    defaultValues,
  });
  const { handleSubmit, watch, reset, formState: { isSubmitting }, } = methods;
  const w_weight = watch('IsWeightDependent');
  const onSubmit = useCallback(async (data: any) => {

    if (medicine) {
      const res = await editMedicine(medicine.id, data);
      if (res?.error) {
        enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
      } else {
        enqueueSnackbar('Updated success!', {
          variant: 'success',
        });
        onClose();
      }

    } else {
      const formD = new FormData();
      const formData = toFormData(data, formD)
      const res = await addMedicine(formData);
      if (res?.error) {
        enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
      } else {
        enqueueSnackbar('Added success!', {
          variant: 'success',
        });
        onClose();
        localStorage.setItem('lastMedicine', JSON.stringify(data))

      }
    }
  }, []);

  // Reset Form
  useEffect(() => {
    const lastMedicine = JSON.parse(localStorage.getItem('lastMedicine')as string);
    if (open) {
      reset({
        ScientificName: medicine?.scientificName || lastMedicine?.ScientificName,
        Formula: medicine?.formula|| lastMedicine?.Formula,
        Indication: medicine?.indication|| lastMedicine?.Indication,
        InitialDose: medicine?.initialDose|| lastMedicine?.InitialDose,
        IsWeightDependent: medicine?.isWeightDependent|| lastMedicine?.IsWeightDependent,
        PharmacologicalGroup: medicine?.pharmacologicalGroup|| lastMedicine?.PharmacologicalGroup,
        Notes: medicine?.notes|| lastMedicine?.Notes,
        PreCautions: medicine?.preCautions|| lastMedicine?.PreCautions,
        SideEffects: medicine?.sideEffects|| lastMedicine?.SideEffects
      });
    }

  }, [open]);
  // console.log(medicine);
  // isWeightDependent
  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={() => onClose()}>
      <DialogTitle sx={{ pb: 0 }}>
        {t(medicine ? 'Edit Medicine' : 'Add New Medicine')}
      </DialogTitle>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ p: 3 }}>
          <RHFTextField InputLabelProps={{ style: { fontWeight: 'bold' } }} name="ScientificName" label={t('Scientific Name')} placeholder={t('Scientific Name')} />
          <RHFTextField name="PharmacologicalGroup" InputLabelProps={{ style: { fontWeight: 'bold' } }} label={t('Pharmacological Group')} placeholder={t('Pharmacological Group')} />
          <RHFSelect name="Formula" InputLabelProps={{ style: { fontWeight: 'bold' } }} label={t('Formula')} placeholder={t('Formula')} >
            {
              formula_options.map((item: { value: number, label: string }, index: number) => (

                <MenuItem key={index} value={item?.value}>{item?.label}</MenuItem>
              ))
            }
          </RHFSelect>
          <RHFTextField name="Indication" InputLabelProps={{ style: { fontWeight: 'bold' } }} label={t('Indication')} placeholder={t('Indication')} />
          <RHFCheckbox name="IsWeightDependent" label={t('By Weight')} />
          <RHFTextField name="InitialDose" InputProps={{
            endAdornment: w_weight ?
              <InputAdornment position="end">mg/kg</InputAdornment> :
              <InputAdornment position="end">mg</InputAdornment>,
          }} InputLabelProps={{ style: { fontWeight: 'bold' } }} label={t('InitialDose')} placeholder={t('InitialDose')}
            helperText="warning edit InitialDose will remove details of the medicine"
          />
          <RHFTextField multiline rows={3} InputLabelProps={{ style: { fontWeight: 'bold' } }} name="Notes" label={t('Notes')} placeholder={t('Notes')} />
          <RHFTextField multiline rows={3} InputLabelProps={{ style: { fontWeight: 'bold' } }} name="PreCautions" label={t('Contraindication')} placeholder={t('Contraindication')} />
          <RHFTextField multiline rows={3} InputLabelProps={{ style: { fontWeight: 'bold' } }} name="SideEffects" label={t('SideEffects')} placeholder={t('SideEffects')} />

        </Stack>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button variant="outlined" onClick={onClose}>
            {t('Cancel')}
          </Button>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            {t(medicine ? 'Edit' : 'Save')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
