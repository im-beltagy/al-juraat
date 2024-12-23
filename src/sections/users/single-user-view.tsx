'use client';

import Image from 'next/image';
import { useCallback } from 'react';

import { Container } from '@mui/system';
import { Card, Typography } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';
import TwoColsTable from 'src/components/shared-table/twoColsTable';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { IUser } from 'src/types/users';

const PERSONAL_INFO = [
  { id: 'name', label: 'User Name' },
  { id: 'phoneNumber', label: 'Phone Number' },
  { id: 'creationTime', label: 'Created At', type: 'date' },
  { id: 'email', label: 'Email Adress' },
  { id: 'packageName', label: 'Package Name', type: 'label' },
];

interface Props {
  user: IUser;
}

export default function SingleUserView({ user }: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();
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

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs heading={user.name as string} links={[{}]} sx={{ mb: 3 }} />

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" paddingInlineStart={2} gutterBottom>
          {t('Personal Information')}
        </Typography>

        <TwoColsTable
          rows={PERSONAL_INFO.map((item) => ({
            label: t(item.label),
            value: renderItemValue({
              value: user[item.id as keyof IUser] || '. . .',
              type: item.type,
            }),
          }))}
        />
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h5" paddingInlineStart={2} gutterBottom>
          {t('Medical Information')}
        </Typography>

        <TwoColsTable
          rows={[
            { label: t('Medical ID'), value: user.medicalId || '. . .' },
            {
              label: t('Medical ID Photo'),
              value: (
                <Image
                  src={`${user.medicalIdImageUrl || '/assets/users/medical.jpeg'}`}
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

      {/*    {!user.isAccepted && (
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
      /> */}
    </Container>
  );
}

/* { id: "2b22c9d5-d1b9-4b46-8051-fb85cecda3e5",
name: "Yousef Ali",
 phoneNumber: "1234567891",
email: "ya16540@fayoum.edu.eg",
 medicalId: null,
  medicalIdImageUrl: null,
 packageName: null, packageId: null,
  creationTime: "2024-09-15T05:53:24.9684381",
isAccepted: false } */
