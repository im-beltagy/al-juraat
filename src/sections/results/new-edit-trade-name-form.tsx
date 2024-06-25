'use client';

import * as yup from 'yup';
import { toFormData } from 'axios';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Stack } from '@mui/system';
import { Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextarea, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

import { TradeName } from 'src/types/results';

interface Props {
  tradeName?: TradeName;
}

export default function NewEditTradeNameForm({ tradeName }: Props) {
  const { t } = useTranslate();

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        logo: yup.mixed<any>().nullable().required(t('Logo is required')),
        name: yup.string().required(t('Name is required')),
        description: yup.string().required(t('Description is required')),
      })
    ),
    defaultValues: {
      logo: tradeName?.logo || null,
      name: tradeName?.name || '',
      description: tradeName?.description || '',
    },
  });

  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    (data: any) => {
      (async () => {
        const formData = new FormData();
        toFormData(data, formData);

        if (tradeName) {
          formData.set('id', tradeName?.id);
          const res = { error: undefined };
          if (res?.error) {
            enqueueSnackbar(`${res?.error}`, { variant: 'error' });
          } else {
            enqueueSnackbar(t('Update success!'));
          }
        } else {
          const res = { error: undefined };
          if (res?.error) {
            enqueueSnackbar(`${res?.error}`, { variant: 'error' });
          } else {
            enqueueSnackbar(t('Added success!'));
          }
        }
      })();
    },
    [enqueueSnackbar, t, tradeName]
  );

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('logo', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} maxWidth="20rem">
        <Box sx={{ mb: 5 }}>
          <RHFUploadAvatar
            name="logo"
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

        <RHFTextField name="name" label={t('Name')} placeholder={t('Name')} />

        <RHFTextarea
          rows={5}
          name="description"
          label={t('Description')}
          placeholder={t('Description')}
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {t(tradeName ? 'Edit' : 'Save')}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
