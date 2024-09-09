'use client';

import Image from 'next/image';
import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import { Container } from '@mui/system';
import { Card, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';
import { getErrorMessage } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { invalidatePath } from 'src/actions/cache-invalidation';

import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import TwoColsTable from 'src/components/shared-table/twoColsTable';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { IUser } from 'src/types/users';

const PERSONAL_INFO = [
  { id: 'name', label: 'User Name' },
  { id: 'phone', label: 'Phone Number' },
  { id: 'created_at', label: 'Created At', type: 'date' },
  { id: 'email', label: 'Email Adress' },
  { id: 'package_name', label: 'Package Name', type: 'label' },
];

interface Props {
  user: IUser;
}

export default function SingleUserView({ user }: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  // eslint-disable-next-line react/no-unused-prop-types
  const renderItemValue = useCallback(({ value, type }: { value: any; type?: string }) => {
    if (!type) return value;

    switch (type) {
      case 'label':
        return (
          <Label color="info" variant="soft">
            {value}
          </Label>
        );
      case 'date':
        return fDate(value, 'dd-MM-yyyy');
      default:
        return value;
    }
  }, []);

  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);

  const handleConfirmAccept = useCallback(() => {
    (async () => {
      try {
        await 'process';
        setIsAcceptDialogOpen(false);
        enqueueSnackbar('Accepted successfully');
        invalidatePath(`${paths.dashboard.users}/${user.id}`);
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      }
    })();
  }, [enqueueSnackbar, user.id]);

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs heading={user.name} links={[{}]} sx={{ mb: 3 }} />

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" paddingInlineStart={2} gutterBottom>
          {t('Personal Information')}
        </Typography>

        <TwoColsTable
          rows={PERSONAL_INFO.map((item) => ({
            label: t(item.label),
            value: renderItemValue({ value: user[item.id as keyof IUser], type: item.type }),
          }))}
        />
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h5" paddingInlineStart={2} gutterBottom>
          {t('Medical Information')}
        </Typography>

        <TwoColsTable
          rows={[
            { label: t('Medical ID'), value: user.medical_id },
            {
              label: t('Medical ID Photo'),
              value: (
                <Image
                  src={user.medical_id_photo}
                  alt="Medical ID Photo"
                  width={200}
                  height={200}
                  objectFit="conver"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              ),
            },
          ]}
        />
      </Card>

      {!user.accepted && (
        <Button
          variant="contained"
          color="warning"
          sx={{ mt: 3, ml: 'auto', color: 'white' }}
          onClick={() => setIsAcceptDialogOpen(true)}
        >
          Accept User
        </Button>
      )}

      <ConfirmDialog
        open={isAcceptDialogOpen}
        onClose={() => setIsAcceptDialogOpen(false)}
        title="Accept User"
        content="Are you sure you want to accept this user?"
        buttonTitle="Accept User"
        buttonColor="warning"
        handleConfirmDelete={() => handleConfirmAccept()}
      />
    </Container>
  );
}
