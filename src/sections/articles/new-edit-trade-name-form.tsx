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

import { Article } from 'src/types/articles';
import { addArticle } from 'src/actions/articles-actions';

interface Props {
  article?: Article;
}

export default function NewEditTradeNameForm({ article }: Props) {
  const { t } = useTranslate();

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        Title: yup.string().required(t('title is required')),
        Content: yup.string().required(t('content is required')),
        ImageFile: yup.mixed<any>().nullable().required(t('image is required')),
      })
    ),
    defaultValues: {
      Title: article?.title || '',
      Content: article?.content || '',
      ImageFile: article?.imageUrl || null,
    },
  });

  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async(data: any) => {
      const formData = new FormData();

      toFormData(data, formData);

        if (article?.id) {
          formData.set('id', article?.id);
          const res = { error: undefined };
          if (res?.error) {
            enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
          } else {
            enqueueSnackbar(t('Update success!'));
          }
        } else {
          const res = await addArticle(formData);
          if (res?.error) {
            enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
          } else {
            enqueueSnackbar(t('Added success!'));
          }
        }

    },
    [ article]
  );

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('ImageFile', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} maxWidth="20rem">
        <Box sx={{ mb: 5 }}>
          <RHFUploadAvatar
            name="ImageFile"
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

        <RHFTextField name="Title" label={t('Title')} placeholder={t('Title')} />

        <RHFTextarea
          rows={5}
          name="Content"
          label={t('Content')}
          placeholder={t('Content')}
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {t(article ? 'Edit' : 'Save')}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
