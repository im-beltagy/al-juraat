'use client';

import * as yup from 'yup';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack, Container } from '@mui/system';
import { Card, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { RHFTextarea } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form/form-provider';
import TwoColsTable, { TableData } from 'src/components/shared-table/twoColsTable';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { SupportTicket } from 'src/types/support-tickets';

const PERSONAL_INFO = [
  { id: 'user_name', label: 'User Name' },
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
];
const PROBLEM_INFO = [
  { id: 'title', label: 'Title' },
  { id: 'subject', label: 'Subject' },
];

interface Props {
  ticket: SupportTicket;
}

export function SingleSupportTicketsView({ ticket }: Props) {
  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        response: yup.string().required('Response is required'),
      })
    ),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    (data: any) => {
      (async () => {
        const res = await { error: undefined };
        if (res?.error) {
          enqueueSnackbar(`${res?.error}`, { variant: 'error' });
        } else {
          enqueueSnackbar('Response sent successfully', { variant: 'success' });
          methods.reset();
          router.push(paths.dashboard.supportTickets);
        }
      })();
    },
    [enqueueSnackbar, methods, router]
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
      <CustomBreadcrumbs heading="Support Ticket" links={[{}]} sx={{ mb: 3 }} />

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" paddingInlineStart={2} gutterBottom>
          Personal Information
        </Typography>

        <TwoColsTable
          rows={
            PERSONAL_INFO.map(({ id, label }: { id: string; label: string }) => ({
              label,
              value: ticket[id as keyof SupportTicket],
            })) as unknown as TableData
          }
        />
      </Card>

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" paddingInlineStart={2} gutterBottom>
          Problem Information
        </Typography>

        <TwoColsTable
          rows={
            PROBLEM_INFO.map(({ id, label }: { id: string; label: string }) => ({
              label,
              value: ticket[id as keyof SupportTicket],
            })) as unknown as TableData
          }
        />
      </Card>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row" spacing={2} alignItems="flex-end">
          <RHFTextarea rows={3} name="response" label="Response" placeholder="Response" />
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Container>
  );
}
