'use client';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useEffect, useCallback, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Stack } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogTitle, DialogActions, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field2';
import { enqueueSnackbar } from 'notistack';
import { TardeNamesImages, TradeNames } from 'src/types/medicine';
import { addMedicine, editMedicine } from 'src/actions/medicine';
import { toFormData } from 'axios';
import { RHFUpload, RHFUploadAvatar, RHFUploadBox, RHFUploadProduct } from 'src/components/hook-form';
import { fData } from 'src/utils/format-number';
import { addTradeNameImage, addTradeNames, deleteTradeNameImage, editTradeNames } from 'src/actions/tradeNames-actions';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { getCookie } from 'cookies-next';

interface Props {
  open: boolean;
  onClose: () => void;
  tradeName?: TradeNames;
  medicineId: string;
}


export default function TradeNamesDialog({ open, onClose, tradeName, medicineId }: Props) {
  const { t } = useTranslate();
  const defaultValues = {
    Images: tradeName?.tradeNamesImages || '',
    Name: tradeName?.name || '',
    Description: tradeName?.description || '',
  };
  const variableSchema = yup.object().shape({
    Images: yup.mixed<any>().nullable().required(t('Image is required')),
    Name: yup.string().required(t('Name is required')),
    Description: yup.string().required(t('Description is required')),

  });


  const methods = useForm({
    resolver: yupResolver(variableSchema),
    defaultValues,
  });
  const { handleSubmit, watch, setValue, reset, formState: { isSubmitting }, } = methods;
  const onSubmit = useCallback(async (data: any) => {

    if (tradeName) {
      const formData = new FormData();
      formData.append('Name', data.Name || values.Name);
      formData.append('Description', data.Description || values.Description);
      const res = await editTradeNames(tradeName.id, formData);
      if (res?.error) {
        enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
      } else {
        enqueueSnackbar('Updated success!', {
          variant: 'success',
        });
      }

    } else {
      const formD = new FormData();
      const images = data.Images || values.Images;
      formD.append('MedicineId', medicineId);
      formD.append('Name', data.Name || values.Name);
      formD.append('Description', data.Description || values.Description);
      images.forEach((image: File) => {
        // Assuming you have the image data as a Blob or File object
        const file = new File([image], image.name, { type: image.type });

        formD.append('images', file, image.name);
      });

      const res = await addTradeNames(formD);

      if (res?.error) {
        enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
      } else {
        enqueueSnackbar('Added success!', {
          variant: 'success',
        });
      }
    }
  }, []);
  const values = watch();
  const [lastImage, setLastImage] = useState<File | null>(null);
  const [disableUpload, setDisableUpload] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  // Reset Form
  useEffect(() => {
    if (open) {

      reset({
        Images: tradeName?.tradeNamesImages,
        Name: tradeName?.name,
        Description: tradeName?.description,
      });
    }


  }, [open]);
  const handleDrop =  async() => {
      const formD = new FormData();
       // const file = new File([image], image.name, { type: image.type });
        if(tradeName && lastImage){

          formD.append('TradNameImage', lastImage);
          const res = await addTradeNameImage(tradeName?.id, formD);

          if (res?.error) {
            enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
          } else {
            enqueueSnackbar('Added success!', {
              variant: 'success',
            });
            setDisableButton(true);
          }
        }





    }

  const handleRemove =  async(image:any) => {
      if(image.id){

        const res = await deleteTradeNameImage(image?.id);

        if (res?.error) {
          enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
        } else {
          enqueueSnackbar('Deleted success!', {
            variant: 'success',
          });
        }
        setValue(
          'Images',
          values.Images && values.Images?.filter((file: any) => file.id !== image.id),
          { shouldValidate: true }
        );
      }
      if(image.path) {
        setValue(
          'Images',
          values.Images?.filter((file: any) => file.hasOwnProperty('id'))
        );
        setLastImage(null);
        setDisableUpload(false);
      }
    };
  const handleDropMultiFile = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.Images || [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setLastImage(newFiles[0]);
      setValue('Images', [...files, ...newFiles], {
        shouldValidate: true,
      });
      setDisableUpload(true);
    },
    [setValue, values.Images, ]
  );

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={() => onClose()}>
      <DialogTitle sx={{ pb: 0 }}>
        {t(tradeName ? 'Edit Trade Name' : 'Add New Trade Name')}
      </DialogTitle>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ p: 3 }}>
          <Box sx={{ mb: 5 }}>
            {/*
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
          /> */}
            {
              !tradeName ?

                <RHFUpload
                  multiple
                  thumbnail
                  name="Images"
                  maxSize={3145728}
                  onDrop={handleDropMultiFile}
                  onRemove={(inputFile) =>
                    setValue(
                      'Images',
                      values.Images && values.Images?.filter((file: any) => file !== inputFile),
                      { shouldValidate: true }
                    )
                  }

                />
                :

                <RHFUpload
                  multiple
                  thumbnail
                  disabled={disableUpload}
                  disableButton={disableButton}
                  name="Images"
                  maxSize={3145728}
                  onDrop={handleDropMultiFile}
                  onRemove={handleRemove }
                  onUpload={handleDrop}
                />
            }



          </Box>
          <RHFTextField InputLabelProps={{ style: { fontWeight: 'bold' } }} name="Name" label={t('Name')} placeholder={t('Name')} />
          <RHFTextField name="Description" multiline rows={3} InputLabelProps={{ style: { fontWeight: 'bold' } }} label={t('Description')} placeholder={t('Description')} />

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
