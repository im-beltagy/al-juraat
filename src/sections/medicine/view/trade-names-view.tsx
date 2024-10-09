'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

import { Avatar, TextField } from '@mui/material';
import { Stack, Container } from '@mui/system';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import TableHeadActions from 'src/components/shared-table/table-head-actions';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { TradeNames } from 'src/types/medicine';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'imageUrl', label: 'Image' },
  { id: 'description', label: 'Description' },
];

interface Props {
  tradeNames: TradeNames[];
  count: number;
}

export default function TradeNamesView({

  tradeNames,
  count,
}: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();
  console.log(tradeNames)
  const table = useTable();

  const router = useRouter();

  const [deleteItemId, setDeleteItemId] = useState('');
  const handleConfirmDelete = useCallback(() => {
    console.log(deleteItemId);
    setDeleteItemId('');
  }, [deleteItemId]);
  const additionalTableProps = {
    onRenderimageUrl: (item: TradeNames) => <Avatar src={item?.imageUrl} />,

   };
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

      <SharedTable
        additionalComponent={<TableHeadActions />}
        dataFiltered={tradeNames}
        table={table}
        count={count}
        disablePagination
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}

        enableAdd
        custom_add_title={t('Add New')}
        handleAdd={() =>  console.log("add")/* router.push(paths.dashboard.results.tradeNames.new) */}
        enableActions
        actions={[
          {
            label: t('View'),
            icon: 'mdi:eye',
            onClick: (item: TradeNames) =>
              router.push(`${paths.dashboard.results.tradeNames.view}/${item.id}`),
          },
        /*   {
            label: t('Edit'),
            icon: 'solar:pen-bold',
            onClick: (item: TradeName) =>
              router.push(`${paths.dashboard.results.tradeNames.edit}/${item.id}`),
          },
          {
            label: t('Delete'),
            icon: 'heroicons:trash-solid',
            onClick: (item: TradeName) => setDeleteItemId(item.id),
          }, */
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
