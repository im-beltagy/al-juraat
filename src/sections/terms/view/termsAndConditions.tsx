'use client';

import * as yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { Card } from '@mui/material';
import { Stack, Container } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';
import { editTerms } from 'src/actions/pages-actions';

import { RHFTextarea } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form/form-provider';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

interface Props {
  terms?: { description: string; slug: string; title: string };
}

export default function TermsAndConditionsView({ terms }: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();
  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        description: yup.string().required('Terms And Conditions is required'),
      })
    ),
    defaultValues: {
      description: terms?.description || '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data: any) => {
      const res = await editTerms(data);
      if (res?.error) {
        enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
      } else {
        enqueueSnackbar(t('Update success!'));
      }
    },
    [t]
  );

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs heading={t('Terms And Conditions')} links={[{}]} sx={{ mb: 3 }} />

      <Card>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} p={2}>
            <RHFTextarea
              rows={5}
              name="description"
              label={t('Terms And Conditions')}
              placeholder={t('Terms And Conditions')}
              dir="ltr"
            />

            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={isSubmitting}
              sx={{
                alignSelf: 'flex-end',
              }}
            >
              {t('Save')}
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Card>
    </Container>
  );
}
