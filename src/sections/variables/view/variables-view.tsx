'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Container } from '@mui/material';

import { useTranslate } from 'src/locales';

import { useTable } from 'src/components/table';
import { useSettingsContext } from 'src/components/settings';
import SharedTable, { TableHeader } from 'src/components/shared-table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import TableHeadActions, { TableFilter } from 'src/components/shared-table/table-head-actions';

import { Variable } from 'src/types/variables';

interface Props {
  variables: Variable[];
  count: number;
}

const TABLE_HEAD = [
  { id: 'name', label: 'Name', static: true },
  { id: 'type', label: 'Type' },
  { id: 'value', label: 'Value' },
];

export default function VariablesView({ variables, count }: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();

  const table = useTable();

  const [tableHead, setTableHead] = useState<TableHeader[]>(TABLE_HEAD);

  const additionalTableProps = {
    onRendervalue: (item: Variable) => item.value ?? '-----',
    onRendertype: (item: Variable) => t(item.type === 'LIST' ? 'List' : 'Range'),
  };

  const router = useRouter();

  const filters: TableFilter[] = useMemo(
    () => [
      { name: 'name', label: t('Name'), type: 'text' },
      { name: 'age', label: t('Age'), type: 'number' },
      {
        name: 'gender',
        label: t('Gender'),
        type: 'list',
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
        ],
      },
    ],
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
      <CustomBreadcrumbs heading={t('Variables')} links={[{}]} sx={{ mb: 3 }} />

      <SharedTable
        additionalComponent={
          <TableHeadActions
            defaultTableHead={TABLE_HEAD}
            setTableHead={(newTableHead: TableHeader[]) => setTableHead(newTableHead)}
            filters={filters}
            handleExport={() => {}}
          />
        }
        dataFiltered={variables}
        table={table}
        count={count}
        tableHeaders={tableHead}
        additionalTableProps={additionalTableProps}
        enableActions
        actions={[
          {
            label: t('edit'),
            icon: 'solar:pen-bold',
            onClick: (item: Variable) => router.push(`/dashboard/banars/edit/${item.id}`),
          },
        ]}
      />
    </Container>
  );
}
