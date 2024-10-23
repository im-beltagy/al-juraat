'use client';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';

import { useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field2';
import { enqueueSnackbar } from 'notistack';
import { Medicine } from 'src/types/medicine';
import { addMedicine, editMedicine } from 'src/actions/medicine';
import { toFormData } from 'axios';

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
      PharmacologicalGroup: medicine?.pharmacologicalGroup || '',
      Notes: medicine?.notes || '',
      PreCautions: medicine?.preCautions || '',
      SideEffects: medicine?.sideEffects || '',
  };
  const variableSchema =  yup.object().shape({
    ScientificName:  yup.string().required(t('ScientificName is required')),
    Formula:  yup.string().required(t('Formula is required')),
    Indication:  yup.string().required(t('Indication is required')),
    InitialDose:  yup.number().required(t('InitialDose is required')),
    PharmacologicalGroup:  yup.string().required(t('PharmacologicalGroup is required')),
    Notes:  yup.string().required(t('Notes is required')),
    PreCautions:  yup.string().required(t('PreCautions is required')),
    SideEffects:  yup.string().required(t('SideEffects is required')),

  });


  const methods = useForm({
    resolver: yupResolver(variableSchema ),
    defaultValues,
  });
  const { handleSubmit,  reset ,formState: { isSubmitting }, } = methods;
  const onSubmit = useCallback( async(data: any) => {

    if(medicine) {
      const res = await editMedicine(medicine.id,data);
      if (res?.error) {
        enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
      } else {
        enqueueSnackbar('Updated success!', {
          variant: 'success',
        });
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
      }
    }
  }, []);

  // Reset Form
  useEffect(() => {
    if(open){

      reset({
      ScientificName: medicine?.scientificName ,
      Formula: medicine?.formula ,
      Indication: medicine?.indication ,
      InitialDose: medicine?.initialDose,
      PharmacologicalGroup: medicine?.pharmacologicalGroup ,
      Notes: medicine?.notes ,
      PreCautions: medicine?.preCautions ,
      SideEffects: medicine?.sideEffects
        });
    }


  }, [open ]);
  console.log(medicine);

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={() => onClose()}>
      <DialogTitle sx={{ pb: 0 }}>
        {t(medicine ? 'Edit Medicine' : 'Add New Medicine')}
      </DialogTitle>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ p: 3 }}>
          <RHFTextField InputLabelProps={{style:{ fontWeight:'bold'}}} name="ScientificName" label={t('Scientific Name')} placeholder={t('Scientific Name')} />
          <RHFTextField name="Formula" InputLabelProps={{style:{ fontWeight:'bold'}}}  label={t('Formula')} placeholder={t('Formula')} />
          <RHFTextField name="Indication" InputLabelProps={{style:{ fontWeight:'bold'}}} label={t('Indication')} placeholder={t('Indication')} />
          <RHFTextField name="InitialDose" InputLabelProps={{style:{ fontWeight:'bold'}}} label={t('InitialDose')} placeholder={t('InitialDose')}
          helperText="warning edit InitialDose will remove details of the medicine"
          />
          <RHFTextField name="PharmacologicalGroup" InputLabelProps={{style:{ fontWeight:'bold'}}} label={t('Pharmacological Group')} placeholder={t('Pharmacological Group')} />
          <RHFTextField multiline rows={3} InputLabelProps={{style:{ fontWeight:'bold'}}} name="Notes" label={t('Notes')} placeholder={t('Notes')} />
          <RHFTextField multiline rows={3} InputLabelProps={{style:{ fontWeight:'bold'}}}  name="PreCautions" label={t('PreCautions')} placeholder={t('PreCautions')} />
          <RHFTextField multiline rows={3} InputLabelProps={{style:{ fontWeight:'bold'}}}  name="SideEffects"  label={t('SideEffects')} placeholder={t('SideEffects')} />

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
