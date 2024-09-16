'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Avatar, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import { useTable } from 'src/components/table';
import { useSettingsContext } from 'src/components/settings';
import SharedTable, { TableHeader } from 'src/components/shared-table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import TableHeadActions, { TableFilter } from 'src/components/shared-table/table-head-actions';

import { IUser } from 'src/types/users';
import { Variable } from 'src/types/variables';
import { getCookie } from 'cookies-next';

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

const filters: TableFilter[] = [
  { name: 'email', label: 'Email', type: 'text' },
  {
    name: 'accepted',
    label: 'Accepted',
    type: 'list',
    options: [
      { label: 'Accepted', value: 'true' },
      { label: 'Not Accepted', value: 'false' },
    ],
  },
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
  const [tableHead, setTableHead] = useState<TableHeader[]>(TABLE_HEAD);

  const additionalTableProps = {
    onRenderphone: (item: IUser) => <span dir="ltr">{item.phoneNumber}</span>,
    onRendermedical_id_photo: (item: IUser) => <Avatar src={`${item.medicalIdImageUrl}`} />,
    onRendercreated_at: (item: IUser) => fDate((item.creationTime as string), 'dd-MM-yyyy'),
    onRenderpackage_name: (item: IUser) => <Label color="info">{item.packageName || ". . ."}</Label>,
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
        additionalComponent={
          <TableHeadActions
            defaultTableHead={TABLE_HEAD}
          /*   setTableHead={(newTableHead: TableHeader[]) => setTableHead(newTableHead)}
            filters={filters.map((item) => ({ ...item, label: t(item.label) }) as TableFilter)}
            handleExport={() => {}} */
          />
        }
        dataFiltered={users}
        table={table}
        count={count}
        tableHeaders={tableHead}
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
