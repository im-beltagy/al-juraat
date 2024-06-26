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
  const onSubmit = useCallback(
    (data: any) => {
      (async () => {
        if (item) {
          const res = await { error: undefined };
          if (res?.error) {
            enqueueSnackbar(`${res?.error}`, { variant: 'error' });
          } else {
            enqueueSnackbar(t('Update success!'));
            if (onClose) onClose();
            methods.reset();
          }
        } else {
          const res = await { error: undefined };
          if (res?.error) {
            enqueueSnackbar(`${res?.error}`, { variant: 'error' });
          } else {
            enqueueSnackbar(t('Added success!'));
            if (onClose) onClose();
            methods.reset();
          }
        }
      })();
    },
    [enqueueSnackbar, item, methods, onClose, t]
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
        ) : (
          <>
            <RHFTextarea
              name="question"
              label={t('Question')}
              placeholder={t('Question')}
              dir="ltr"
            />
            <RHFTextarea name="answer" label={t('Answer')} placeholder={t('Answer')} dir="rtl" />
          </>
        )}

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
