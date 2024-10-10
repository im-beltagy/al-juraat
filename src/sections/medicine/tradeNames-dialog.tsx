'use client';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Stack } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogTitle, DialogActions, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field2';
import { enqueueSnackbar } from 'notistack';
import { TradeNames } from 'src/types/medicine';
import { addMedicine, editMedicine } from 'src/actions/medicine';
import { toFormData } from 'axios';
import { RHFUploadAvatar } from 'src/components/hook-form';
import { fData } from 'src/utils/format-number';
import { addTradeNames, editTradeNames } from 'src/actions/tradeNames-actions';

interface Props {
  open: boolean;
  onClose: () => void;
  tradeName?: TradeNames;
  medicineId:string;
}


export default function TradeNamesDialog({ open, onClose, tradeName, medicineId }: Props) {
  const { t } = useTranslate();
  const defaultValues = {
    Image:tradeName?.imageUrl || '',
    Name:tradeName?.name || '',
    Description: tradeName?.description || '',
  };
  const variableSchema =  yup.object().shape({
    Image:  yup.mixed<any>().nullable().required(t('Image is required')),
    Name:  yup.string().required(t('Name is required')),
    Description:  yup.string().required(t('Description is required')),

  });


  const methods = useForm({
    resolver: yupResolver(variableSchema ),
    defaultValues,
  });
  const { handleSubmit,setValue,reset ,formState: { isSubmitting }, } = methods;
  const onSubmit = useCallback( async(data: any) => {

    if(tradeName) {
      const formData = new FormData();
      toFormData(data,formData)
      const res = await editTradeNames(tradeName.id,formData);
      if (res?.error) {
        enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
      } else {
        enqueueSnackbar('Updated success!', {
          variant: 'success',
        });
      }

    } else {
      const formD = new FormData();
      const formData = toFormData(data, formD);
      formD.append("MedicineId", medicineId)
      const res = await addTradeNames(formData);
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
        Image:tradeName?.imageUrl,
        Name:tradeName?.name,
        Description: tradeName?.description ,
        });
    }


  }, [open ]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('Image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={() => onClose()}>
      <DialogTitle sx={{ pb: 0 }}>
        {t(tradeName ? 'Edit Trade Name' : 'Add New Trade Name')}
      </DialogTitle>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ mb: 5 }}>
          <RHFUploadAvatar
            name="Image"
            maxSize={3145728}
            onDrop={handleDrop}
            helperText={
              <Typography
                variant="caption"
                sx={{
                  mt: 3,
                  mx: 'auto',
                  display: 'block',
                  textAlign: 'center',
                  color: 'text.disabled',
                }}
              >
                {`${t('Allowed')} *.jpeg, *.jpg, *.png, *.gif`}
                <br /> {`${t('Max Size')}  ${fData(3145728)}`}
              </Typography>
            }
          />
        </Box>
          <RHFTextField InputLabelProps={{style:{ fontWeight:'bold'}}} name="Name" label={t('Name')} placeholder={t('Name')} />
          <RHFTextField name="Description" multiline rows={3} InputLabelProps={{style:{ fontWeight:'bold'}}}  label={t('Description')} placeholder={t('Description')} />

        </Stack>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button variant="outlined" onClick={onClose}>
            {t('Cancel')}
          </Button>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            {t(tradeName ? 'Edit' : 'Save')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
