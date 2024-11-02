'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

import { Avatar, TextField } from '@mui/material';
import { Stack, Container } from '@mui/system';


import { useTranslate } from 'src/locales';

import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import TableHeadActions from 'src/components/shared-table/table-head-actions';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { TradeNames } from 'src/types/medicine';
import TradeNamesDialog from '../tradeNames-dialog';
import { deleteTradeName } from 'src/actions/tradeNames-actions';
import { enqueueSnackbar } from 'notistack';
import { paths } from 'src/routes/paths';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
/*   { id: 'imageUrl', label: 'Image' },
 */  { id: 'description', label: 'Description' },
];

interface Props {
  tradeNames: TradeNames[];
  count: number;
  medicineId:string;
}

export default function TradeNamesView({

  tradeNames,
  count,
  medicineId,
}: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();
  const table = useTable();
  const [deleteItemId, setDeleteItemId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [choosenTradeName, setChoosenTradeName] = useState<TradeNames | undefined>(undefined);
  const router = useRouter();

  const additionalTableProps = {

   };

  const handleConfirmDelete = useCallback(async() => {

    const res = await deleteTradeName(deleteItemId);

    if (res?.error) {
      enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
    } else {
      enqueueSnackbar('Deleted success!', {
        variant: 'success',
      });
    }
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

      <SharedTable
        additionalComponent={<TableHeadActions />}
        dataFiltered={tradeNames}
        table={table}
        count={count}
        disablePagination
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}

        enableAdd
        custom_add_title={t('Add New Trade Name')}
        handleAdd={() => {
          setChoosenTradeName(undefined);
          setIsDialogOpen(true);
        }}
        enableActions
        actions={[
          {
            label: t('View'),
            icon: 'mdi:eye',
            onClick: (item: TradeNames) =>
              router.push(`${paths.dashboard.medicine}/trade-names/view/${item.id}`),
          },

          {
            label: t('Edit'),
            icon: 'solar:pen-bold',
            onClick: (item: TradeNames) => {
              setChoosenTradeName(item);
              setIsDialogOpen(true);
            }
          },
          {
            label: t('Delete'),
            icon: 'heroicons:trash-solid',
            onClick: (item: TradeNames) => setDeleteItemId(item.id),
          },
        ]}
      />
      {isDialogOpen ? (
        <TradeNamesDialog
          open={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setChoosenTradeName(undefined);
          }}
         tradeName={choosenTradeName}
         medicineId={medicineId}
        />
      ) : null}
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
