'use client';

import { useRouter } from 'next/navigation';

import { Avatar, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import TableHeadActions from 'src/components/shared-table/table-head-actions';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { IUser } from 'src/types/users';
import { Variable } from 'src/types/variables';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', static: true },
  { id: 'phone', label: 'Phone' },
  { id: 'medicalId', label: 'Medical ID', static: true },
  { id: 'medical_id_photo', label: 'Medical ID Photo' },
  { id: 'created_at', label: 'Created At' },
  { id: 'email', label: 'Email' },
  { id: 'package_name', label: 'Package Name' },
  { id: 'accepted', label: 'Accepted' },
];

interface Props {
  users: IUser[];
  count: number;
}

export default function UsersView({ users, count }: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();
  // Table
  const table = useTable();

  const additionalTableProps = {
    onRenderphone: (item: IUser) => <span dir="ltr">{item.phoneNumber}</span>,
    onRendermedical_id_photo: (item: IUser) => <Avatar src={`${item.medicalIdImageUrl}`} />,
    onRendercreated_at: (item: IUser) => fDate(item.creationTime as string, 'dd-MM-yyyy'),
    onRenderpackage_name: (item: IUser) => (
      <Label color="info">{item.packageName || '. . .'}</Label>
    ),
    onRenderaccepted: (item: IUser) => (
      <Label color={item.isAccepted ? 'success' : 'error'}>
        {item.isAccepted ? 'Accepted' : 'Not Accepted'}
      </Label>
    ),
  };

  const router = useRouter();

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs heading={t('Users')} links={[{}]} sx={{ mb: 3 }} />

      <SharedTable
        additionalComponent={<TableHeadActions defaultTableHead={TABLE_HEAD} />}
        dataFiltered={users}
        table={table}
        count={count}
        enableSearchField
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        enableActions
        actions={[
          {
            label: t('View'),
            icon: 'mdi:eye',
            onClick: (item: Variable) => router.push(`${paths.dashboard.users}/${item.id}`),
          },
        ]}
      />
    </Container>
  );
}
