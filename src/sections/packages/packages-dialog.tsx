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

import { Package } from 'src/types/packages';
import { addPackage, editPackage } from 'src/actions/packages-actions';
import { enqueueSnackbar } from 'notistack';

interface Props {
  open: boolean;
  onClose: () => void;
  choosenPackage?: Package;
}

export default function PackagesDialog({ open, onClose, choosenPackage }: Props) {
  const { t } = useTranslate();
  const defaultValues = {
    name: choosenPackage?.name || '',
      price: choosenPackage?.price || 0,
      duration: choosenPackage?.durationInDays || 0,
  };
  const variableSchema =  yup.object().shape({
    name: yup.string().required(t('Name is required')),
    price: yup.number().required(t('Price is required')),
    duration: yup.number().required(t('Duration is required')),
  });


  const methods = useForm({
    resolver: yupResolver(variableSchema ),
    defaultValues,
  });
  const { handleSubmit, setValue, clearErrors,getValues, reset, formState: { isSubmitting  }} = methods;
  const onSubmit = useCallback( async(data: any) => {
    const dataForm = {
      "name": data?.name,
      "price": data?.price,
      "durationInDays":data?.duration,
    }
    if(choosenPackage) {
      const res = await editPackage(choosenPackage.id,dataForm);
      if (res?.error) {
        enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
      } else {
        enqueueSnackbar('Updated success!', {
          variant: 'success',
        });
        onClose();
      }

    } else {
      const res = await addPackage(dataForm);
      if (res?.error) {
        enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
      } else {
        enqueueSnackbar('Added success!', {
          variant: 'success',
        });
        onClose();
      }
    }
  }, []);

  // Reset Form
  useEffect(() => {
    if(open){

      reset({name:choosenPackage?.name, price:choosenPackage?.price,duration:choosenPackage?.durationInDays});
    }


  }, [open ]);

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={() => onClose()}>
      <DialogTitle sx={{ pb: 0 }}>
        {t(choosenPackage ? 'Edit Package' : 'Add New Package')}
      </DialogTitle>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ p: 3 }}>
          <RHFTextField name="name" label={t('Name')} placeholder={t('Name')} />
          <RHFTextField name="price" type="number" label={t('Price')} placeholder={t('Price')} />
          <RHFTextField
            name="duration"
            type="number"
            label={t('Duration')}
            placeholder={t('Duration in days')}
          />
        </Stack>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button variant="outlined" onClick={onClose}>
            {t('Cancel')}
          </Button>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            {t(choosenPackage ? 'Edit' : 'Save')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
