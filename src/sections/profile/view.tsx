'use client';

import * as yup from 'yup';
import { toFormData } from 'axios';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';

import { Box, Stack } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';
import { Container, Typography, DialogActions } from '@mui/material';

import { useTranslate } from 'src/locales';
import { countries } from 'src/assets/data';
import {
  editEmail,
  verifyEmail,
  editPhoneAndName,
  verifyPhoneAndName,
} from 'src/actions/profile-actions';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import FormProvider, { RHFCode, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { IProfile } from 'src/types/profile';

interface Props {
  profile: IProfile;
}

export default function Profile({ profile }: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();
  const [sendOtp, setSendOtp] = useState(false);
  const defaultValues = {
    Name: profile?.name || '',
    PhoneNumber: profile?.phoneNumber?.slice(2) || '',
    Country: '',
    code: '',
  };
  const variableSchema = yup.object().shape({
    Name: yup.string().required(t('Name is required')),
    PhoneNumber: yup.string().required(t('PhoneNumber is required')),
    Country: yup.string().required(t('Country is required')),
    code: yup.string() /* .min(4, 'Code must be at least 4 characters') */,
  });

  const methods = useForm({
    resolver: yupResolver(variableSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = useCallback(
    async (data: any) => {
      const code = countries?.find((item) => item.label === data?.Country);
      const phone = code?.phone.concat(data?.PhoneNumber) as string;
      if (!sendOtp) {
        const formD = {
          Name: data?.Name,
          PhoneNumber: phone,
          PhoneCode: code?.phone,
        };

        const res = await editPhoneAndName(formD);
        if (res?.error) {
          enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
        } else {
          enqueueSnackbar('Sent success!', {
            variant: 'success',
          });
          setSendOtp(true);
        }
      } else {
        const forData = new FormData();
        const formD = {
          Code: data?.code,
        };
        toFormData(formD, forData);
        const res = await verifyPhoneAndName(forData);
        if (res?.error) {
          enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
        } else {
          enqueueSnackbar('Updated success!', {
            variant: 'success',
          });
          setSendOtp(false);
        }
      }
    },
    [sendOtp]
  );

  // Reset Form
  useEffect(() => {
    reset({
      Name: profile?.name,
      PhoneNumber: profile?.phoneNumber?.slice(2),
      Country: '',
      code: '',
    });
    setSendOtp(sendOtp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs heading={t('Profile')} links={[{}]} sx={{ mb: 3 }} />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ p: 3 }}>
          <Box sx={{ mb: 5 }} />
          <RHFTextField
            disabled={sendOtp}
            InputLabelProps={{ style: { fontWeight: 'bold' } }}
            name="Name"
            label={t('Name')}
            placeholder={t('Name')}
          />
          <RHFAutocomplete
            name="Country"
            type="country"
            disabled={sendOtp}
            fullWidth
            label="Country"
            placeholder="Choose a country"
            options={countries.map((option) => option.label)}
            getOptionLabel={(option) => option}
          />
          <RHFTextField
            disabled={sendOtp}
            InputLabelProps={{ style: { fontWeight: 'bold' } }}
            name="PhoneNumber"
            label={t('Phone')}
            placeholder={t('Phone')}
          />

          <Typography variant="overline" sx={{ display: sendOtp ? 'inherit' : 'none' }}>
            Verify code
          </Typography>
          <RHFCode name="code" sx={{ display: sendOtp ? 'inherit' : 'none' }} />
        </Stack>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            {!sendOtp ? t('Send and Save') : t('Edit')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
      <EditEmail profile={profile} />
    </Container>
  );
}

export function EditEmail({ profile }: { profile: IProfile }) {
  const { t } = useTranslate();
  const [sendOtp, setSendOtp] = useState(false);
  const defaultValues = {
    email: '',
    code: '',
  };
  const variableSchema = yup.object().shape({
    email: yup.string().email('Not vaild Email').required(t('Email is required')),
    code: yup.string() /* .min(4, 'Code must be at least 4 characters') */,
  });

  const methods = useForm({
    resolver: yupResolver(variableSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = useCallback(
    async (data: any) => {
      if (!sendOtp) {
        const formData = new FormData();
        const formD = {
          NewEmail: data?.email,
        };
        toFormData(formD, formData);
        const res = await editEmail(formData);
        if (res?.error) {
          enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
        } else {
          enqueueSnackbar('Sent success!', {
            variant: 'success',
          });
          setSendOtp(true);
        }
      } else {
        const formData = new FormData();
        const formD = {
          Code: data?.code,
        };
        toFormData(formD, formData);
        const res = await verifyEmail(formData);
        if (res?.error) {
          enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
        } else {
          enqueueSnackbar('Updated success!', {
            variant: 'success',
          });
          setSendOtp(false);
        }
      }
    },
    [sendOtp]
  );

  // Reset Form
  useEffect(() => {
    reset({
      email: profile?.email,
      code: '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box>
          <RHFTextField
            disabled={sendOtp}
            type="email"
            InputLabelProps={{ style: { fontWeight: 'bold' } }}
            name="email"
            label={t('Email')}
            placeholder={t('Email')}
          />
        </Box>
        <Typography variant="overline" sx={{ display: sendOtp ? 'inherit' : 'none' }}>
          Verify code
        </Typography>
        <RHFCode name="code" sx={{ display: sendOtp ? 'inherit' : 'none' }} />
      </Stack>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
          {!sendOtp ? t('Send and Save') : t('Edit')}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
