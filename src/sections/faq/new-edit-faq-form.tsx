'use client';

import * as yup from 'yup';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack } from '@mui/system';
import { Grid } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';

import { RHFTextarea } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

import { FAQItem } from 'src/types/faq';
import { addFAQ, editFAQ } from 'src/actions/faq-actions';
import React from 'react';

interface Props {
  item?: FAQItem;
  row?: Boolean;
  onClose?: () => void;
}

export default function NewEditFaqForm({ item, row, onClose }: Props) {
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        question: yup.string().required(t('Question is required')),
        answer: yup.string().required(t('Answer is required')),
      })
    ),
    defaultValues: {
      question: item?.question || '',
      answer: item?.answer || '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = useCallback( async(data: any) => {
    const formData = {
      "question": data?.question,
      "answer": data?.answer
       };
        if (item?.id) {

          const res = await editFAQ(item?.id, data);
          if (res?.error) {
            enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
          } else {
            enqueueSnackbar(t('Update success!'));
          }
        } else {
          const res = await addFAQ(formData);
          if (res?.error) {
            enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
          } else {
            enqueueSnackbar(t('Added success!'));
          }
        }

    },
    [ item]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        {row ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <RHFTextarea
                name="question"
                label={t('Question')}
                placeholder={t('Question')}
                dir="ltr"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextarea name="answer" label={t('Answer')} placeholder={t('Answer')} dir="rtl" />
            </Grid>
          </Grid>
        ) :
          <>
            <RHFTextarea
              name="question"
              label={t('Question')}
              placeholder={t('Question')}
              dir="ltr"
            />
            <RHFTextarea name="answer" label={t('Answer')} placeholder={t('Answer')} dir="rtl" />
          </>
        }

        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={isSubmitting}
          sx={{
            alignSelf: 'flex-end',
          }}
        >
          {t(item ? 'Edit' : 'Add')}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
