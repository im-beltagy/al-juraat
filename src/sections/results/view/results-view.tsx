'use client';

import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

import { Grid, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useQueryString } from 'src/hooks/use-queryString';

import { useTranslate } from 'src/locales';
import { deleteResult } from 'src/actions/results-actions';

import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
// import PackagesDialog from '../packages-dialog';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field2';
import TableHeadActions from 'src/components/shared-table/table-head-actions';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { Result } from 'src/types/results';

const TABLE_HEAD = [
  { id: 'scientificName', label: 'Scientific Name' },
  { id: 'indication', label: 'Indication' },
  { id: 'formula', label: 'Formula' },
];

interface Props {
  results: Result[];
  count: number;
}

export default function MedicineView({ results, count }: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();
  const [deleteItemId, setDeleteItemId] = useState('');
  const router = useRouter();

  const { createQueryString } = useQueryString();

  // Table
  const table = useTable();

  const methods = useForm({
    defaultValues: {
      scientific_name: '',
      formula: '',
      indication: '',
    },
  });

  const { setValue, getValues } = methods;
  const additionalTableProps = {
    onRenderindication: (item: Result) => (
      <Typography
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '150px' }}
        variant="body2"
      >
        {item?.indication}
      </Typography>
    ),
  };
  console.log(results);
  const handleConfirmDelete = useCallback(async () => {
    const res: any = await deleteResult(deleteItemId);

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
      <CustomBreadcrumbs heading={t('Results')} links={[{}]} sx={{ mb: 3 }} />
      <FormProvider methods={methods}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="scientific_name"
              label={t('Scientific name')}
              placeholder={t('Scientific name')}
              onChange={(event) => {
                setValue('scientific_name', event.target.value);
                createQueryString(
                  [{ name: 'scientific_name', value: getValues('scientific_name') }],
                  true
                );
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="formula"
              label={t('Formula')}
              placeholder={t('Formula')}
              onChange={(event) => {
                setValue('formula', event.target.value);
                createQueryString([{ name: 'formula', value: getValues('formula') }], true);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="indication"
              label={t('Indication')}
              placeholder={t('Indication')}
              onChange={(event) => {
                setValue('indication', event.target.value);
                createQueryString([{ name: 'indication', value: getValues('indication') }], true);
              }}
            />
          </Grid>
        </Grid>
      </FormProvider>

      <SharedTable
        additionalComponent={<TableHeadActions />}
        dataFiltered={results}
        table={table}
        count={count}
        disablePagination
        showFromClients
        enableActions
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        actions={[
          {
            label: t('Details'),
            icon: 'mdi:eye',
            onClick: (item: Result) => {
              router.push(`${paths.dashboard.calculation.finalResult}&equationId=${item.id}`);
            },
          },
          {
            label: t('Delete'),
            icon: 'heroicons:trash-solid',
            onClick: (item: Result) => setDeleteItemId(item.id),
          },
          /*   {
            label: t('View Trade names'),
            icon: 'mdi:eye',
            onClick: (item: Medicine) =>
              router.push(`${paths.dashboard.medicine}/trade-names/${item.id}`),
          }, */
        ]}
      />
      {deleteItemId && (
        <ConfirmDialog
          open={!!deleteItemId}
          onClose={() => setDeleteItemId('')}
          title="Delete"
          content="Are you sure you want to delete this item?"
          handleConfirmDelete={handleConfirmDelete}
        />
      )}
      {/* {isDialogOpen ? (
        <MedicineDialog
          open={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setChoosenMedicine(undefined);
          }}
         medicine={choosenMedicine}
        />
      ) : null} */}
    </Container>
  );
}
