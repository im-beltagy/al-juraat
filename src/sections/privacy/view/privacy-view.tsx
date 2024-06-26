'use client';

import * as yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Card } from '@mui/material';
import { Stack, Container } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';

import { RHFTextarea } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form/form-provider';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

interface Props {
  privacy_en?: string;
  privacy_ar?: string;
}

export default function PrivacyView({ privacy_en, privacy_ar }: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        privacy_en: yup.string().required('Privacy policy is required'),
        privacy_ar: yup.string().required('Privacy policy is required'),
      })
    ),
    defaultValues: {
      privacy_en: privacy_en || '',
      privacy_ar: privacy_ar || '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = useCallback((data: any) => {}, []);

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs heading={t('Privacy Policy')} links={[{}]} sx={{ mb: 3 }} />

      <Card>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} p={2}>
            <RHFTextarea
              rows={5}
              name="privacy_en"
              label={t('Privacy Policy (English)')}
              placeholder={t('Privacy Policy (English)')}
              dir="ltr"
            />
            <RHFTextarea
              rows={5}
              name="privacy_ar"
              label={t('Privacy Policy (Arabic)')}
              placeholder={t('Privacy Policy (Arabic)')}
              dir="rtl"
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
