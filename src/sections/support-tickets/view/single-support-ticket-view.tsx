'use client';

import * as yup from 'yup';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack, Container } from '@mui/system';
import { Card, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { editAnswer } from 'src/actions/support-tickets-actions';

import { RHFTextarea } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form/form-provider';
import TwoColsTable, { TableData } from 'src/components/shared-table/twoColsTable';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { SupportTicket } from 'src/types/support-tickets';

const PERSONAL_INFO = [
  { id: 'name', label: 'User Name' },
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
];
const PROBLEM_INFO = [
  { id: 'title', label: 'Title' },
  { id: 'subject', label: 'Subject' },
  { id: 'answer', label: 'Answer' },
];

interface Props {
  ticket: SupportTicket;
}

export function SingleSupportTicketsView({ ticket }: Props) {
  const settings = useSettingsContext();
  console.log(ticket);
  const { enqueueSnackbar } = useSnackbar();

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
    async (data: any) => {
      console.log(data);
      const res = await editAnswer(ticket?.id, data?.response);
      if (res?.error) {
        enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
      } else {
        enqueueSnackbar('Updated success!', {
          variant: 'success',
        });
      }
    },
    [enqueueSnackbar, ticket?.id]
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
              // eslint-disable-next-line no-nested-ternary
              value: ticket[id as keyof SupportTicket]
                ? ticket[id as keyof SupportTicket]
                : label === 'Answer'
                  ? 'No answer yet'
                  : '',
            })) as unknown as TableData
          }
        />
      </Card>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row" spacing={2} alignItems="flex-end">
          <RHFTextarea
            disabled={String(ticket.answer) !== 'null'}
            rows={3}
            name="response"
            label="Your Answer"
            placeholder="Your Answer"
          />
          <LoadingButton
            disabled={String(ticket.answer) !== 'null'}
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
          >
            Submit
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Container>
  );
}
