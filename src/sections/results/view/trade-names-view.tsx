'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

import { TextField } from '@mui/material';
import { Stack, Container } from '@mui/system';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import TableHeadActions from 'src/components/shared-table/table-head-actions';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { TradeName } from 'src/types/results';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
];

interface Props {
  medicine: string;
  formula: string;
  indication: string;
  tradeNames: TradeName[];
  count: number;
}

export default function TradeNamesView({
  medicine,
  formula,
  indication,
  tradeNames,
  count,
}: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();

  const table = useTable();

  const router = useRouter();

  const [deleteItemId, setDeleteItemId] = useState('');
  const handleConfirmDelete = useCallback(() => {
    console.log(deleteItemId);
    setDeleteItemId('');
  }, [deleteItemId]);

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs heading={t('Trade Names')} links={[{}]} sx={{ mb: 3 }} />

      <Stack spacing={2} mb={3}>
        {[
          ['Medicine', medicine],
          ['Formula', formula],
          ['Indication', indication],
        ].map(([label, value]) => (
          <TextField
            label={t(label)}
            value={value}
            fullWidth
            sx={{ maxWidth: '20rem' }}
            InputProps={{ readOnly: true }}
            key={label}
          />
        ))}
      </Stack>

      <SharedTable
        additionalComponent={<TableHeadActions handleExport={() => {}} />}
        dataFiltered={tradeNames}
        table={table}
        count={count}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={{}}
        enableAdd
        custom_add_title={t('Add New')}
        handleAdd={() => router.push(paths.dashboard.results.tradeNames.new)}
        enableActions
        actions={[
          {
            label: t('View'),
            icon: 'mdi:eye',
            onClick: (item: TradeName) =>
              router.push(`${paths.dashboard.results.tradeNames.view}/${item.id}`),
          },
          {
            label: t('Edit'),
            icon: 'solar:pen-bold',
            onClick: (item: TradeName) =>
              router.push(`${paths.dashboard.results.tradeNames.edit}/${item.id}`),
          },
          {
            label: t('Delete'),
            icon: 'heroicons:trash-solid',
            onClick: (item: TradeName) => setDeleteItemId(item.id),
          },
        ]}
      />

      {deleteItemId && (
        <ConfirmDialog
          open={!!deleteItemId}
          onClose={() => setDeleteItemId('')}
          title={t('Delete')}
          content={t('delete_confirm')}
          handleConfirmDelete={handleConfirmDelete}
        />
      )}
    </Container>
  );
}
