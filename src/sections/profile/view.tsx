'use client';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useEffect, useCallback, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { Box, Stack } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogTitle, DialogActions,Container, Typography, FormControlLabel } from '@mui/material';

import { useTranslate } from 'src/locales';
import { countries } from 'src/assets/data';

import FormProvider, { RHFAutocomplete, RHFTextField ,RHFCode} from 'src/components/hook-form';
import { enqueueSnackbar } from 'notistack';
import { TardeNamesImages, TradeNames } from 'src/types/medicine';
import { addMedicine, editMedicine } from 'src/actions/medicine';
import { toFormData } from 'axios';
import { RHFUpload, RHFUploadAvatar, RHFUploadBox, RHFUploadProduct } from 'src/components/hook-form';
import { fData } from 'src/utils/format-number';
import { addTradeNameImage, addTradeNames, deleteTradeNameImage, editTradeNames } from 'src/actions/tradeNames-actions';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { getCookie } from 'cookies-next';
import { IProfile } from 'src/types/profile';
import { useSettingsContext } from 'src/components/settings';
import { editEmail, editPhoneAndName, verifyEmail, verifyPhoneAndName } from 'src/actions/profile-actions';

interface Props {
  profile:IProfile
}


export default function Profile({ profile }: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();
  const [sendOtp, setSendOtp] = useState(false);
//console.log(profile)
  const defaultValues = {
    Name: profile?.name || '',
    PhoneNumber: profile?.phoneNumber?.slice(2) || '',
    Country:'',
    code: '',

  };
  const variableSchema = yup.object().shape({
    Name: yup.string().required(t('Name is required')),
    PhoneNumber: yup.string().required(t('PhoneNumber is required')),
    Country: yup.string().required(t('Country is required')),
    code: yup.string()/* .min(4, 'Code must be at least 4 characters') */,

  });

console.log(profile)
  const methods = useForm({
    resolver: yupResolver(variableSchema),
    defaultValues,
  });
  const { handleSubmit, watch, setValue, reset, formState: { isSubmitting }, } = methods;
  const onSubmit = useCallback(async (data: any) => {
    const code = countries?.find((item)=>item.label === data?.Country)
    const phone =  code?.phone.concat(data?.PhoneNumber) as string;
    if(!sendOtp) {
      const formD = {
        "Name":data?.Name,
        "PhoneNumber":phone,
        "PhoneCode":code?.phone
      };

      console.log(formD);
       const res = await editPhoneAndName(formD);
      if (res?.error) {
        enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
      } else {
        enqueueSnackbar('Sent success!', {
          variant: 'success',
        });
        setSendOtp(true);
    }
    }
    else  {
      const forData = new FormData();
      const formD = {
        "Code":data?.code
      };
      toFormData(formD, forData)
      console.log(formD);
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

  }, [sendOtp]);
  const values = watch();
  const [lastImage, setLastImage] = useState<File | null>(null);
  const [disableUpload, setDisableUpload] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  // Reset Form
  useEffect(() => {
      reset({
        Name: profile?.name ,
        PhoneNumber: profile?.phoneNumber?.slice(2) ,
        Country:  '',
        code: '',

      });
      setSendOtp(sendOtp);
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
          <Box sx={{ mb: 5 }}>
          </Box>
          <RHFTextField   disabled={sendOtp} InputLabelProps={{ style: { fontWeight: 'bold' } }} name="Name" label={t('Name')} placeholder={t('Name')} />
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
          <RHFTextField   disabled={sendOtp} InputLabelProps={{ style: { fontWeight: 'bold' } }} name="PhoneNumber" label={t('Phone')} placeholder={t('Phone')} />

          <Typography  variant="overline" sx={{display: sendOtp? 'inherit': 'none'}}>
            Verify code
          </Typography>
          <RHFCode  name="code"  sx={{display: sendOtp? 'inherit': 'none'}}  />
        </Stack>

        <DialogActions sx={{ p: 3, pt: 0 }}>

          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            {!sendOtp? t('Send and Save'): t("Edit")}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
      <EditEmail profile={profile} />
      </Container>

  );
}



export  function EditEmail({profile}:{ profile:IProfile}) {
  const { t } = useTranslate();
  const settings = useSettingsContext();
  const [sendOtp, setSendOtp] = useState(false);
//console.log(profile)
  const defaultValues = {
    email: '',
    code: '',
  };
  const variableSchema = yup.object().shape({
    email: yup.string().email('Not vaild Email').required(t('Email is required')),
    code: yup.string()/* .min(4, 'Code must be at least 4 characters') */,

  });

  const methods = useForm({
    resolver: yupResolver(variableSchema),
    defaultValues,
  });
  const { handleSubmit, watch, setValue, reset, formState: { isSubmitting }, } = methods;
  const onSubmit = useCallback(async (data: any) => {
    if(!sendOtp) {
      const formData = new FormData();
      const formD = {
        "NewEmail":data?.email
      };
      toFormData(formD, formData);
      console.log(formD);
       const res = await editEmail(formData);
      if (res?.error) {
        enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
      } else {
        enqueueSnackbar('Sent success!', {
          variant: 'success',
        });
        setSendOtp(true);
    }
    }
    else  {
      const formData = new FormData();
      const formD = {
        "Code":data?.code
      };
      toFormData(formD, formData);
      console.log(formD);
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

  }, [sendOtp]);

  // Reset Form
  useEffect(() => {
      reset({
        email: profile?.email ,
        code: ''
      });
  }, [profile]);



  return (

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ p: 3 }}>
          <Box >
          <RHFTextField   disabled={sendOtp} type="email" InputLabelProps={{ style: { fontWeight: 'bold' } }} name="email" label={t('Email')} placeholder={t('Email')} />
          </Box>
          <Typography  variant="overline" sx={{display: sendOtp? 'inherit': 'none'}}>
            Verify code
          </Typography>
          <RHFCode  name="code"  sx={{display: sendOtp? 'inherit': 'none'}}  />
        </Stack>

        <DialogActions sx={{ p: 3, pt: 0 }}>

          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            {!sendOtp? t('Send and Save'): t("Edit")}
          </LoadingButton>
        </DialogActions>
      </FormProvider>

  );
}

