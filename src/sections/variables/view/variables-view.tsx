'use client';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter, useSearchParams } from 'next/navigation';

import LoadingButton from '@mui/lab/LoadingButton';
import { Grid, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useQueryString } from 'src/hooks/use-queryString';

import { useTranslate } from 'src/locales';
import { invalidatePath } from 'src/actions/cache-invalidation';

import { useTable } from 'src/components/table';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider from 'src/components/hook-form/form-provider';
import SharedTable, { TableHeader } from 'src/components/shared-table';
import RHFTextField from 'src/components/hook-form/rhf-text-field-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import TableHeadActions, { TableFilter } from 'src/components/shared-table/table-head-actions';
import CustomAutocompleteView, { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';

import { Variable } from 'src/types/variables';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', static: true },
  { id: 'type', label: 'Type' },
  { id: 'value', label: 'Value' },
];

const filters: TableFilter[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'age', label: 'Age', type: 'number' },
  {
    name: 'gender',
    label: 'Gender',
    type: 'list',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ],
  },
];

const VARIABLE_TYPES = [
  { label: 'Range', value: 'range' },
  { label: 'List', value: 'list' },
];

interface Props {
  variables: Variable[];
  count: number;
}

export default function VariablesView({ variables, count }: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();

  const { createQueryString } = useQueryString();
  const searchParams = useSearchParams();
  const variableType = searchParams.get('type');

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required(t('Name is required')),
        type: yup
          .object()
          .shape({
            id: yup.string().required(t('Type is required')),
            name: yup.string().required(t('Type is required')),
            name_ar: yup.string().required(t('Type is required')),
            name_en: yup.string().required(t('Type is required')),
          })
          .required(t('Type is required')),
        value:
          searchParams.get('type') === 'range'
            ? yup.string()
            : yup.string().required(t('Value is required')),
      })
    ),
  });

  const { handleSubmit } = methods;

  const [isLoading, setIsloading] = useState(false);

  const onSubmit = useCallback((data: any) => {
    setIsloading(true);
    console.log(data);
    invalidatePath(paths.dashboard.root);
    setIsloading(false);
  }, []);

  // Table
  const table = useTable();

  const [tableHead, setTableHead] = useState<TableHeader[]>(TABLE_HEAD);

  const additionalTableProps = {
    onRendervalue: (item: Variable) => item.value ?? '-----',
    onRendertype: (item: Variable) => t(item.type === 'list' ? 'List' : 'Range'),
  };

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
      <CustomBreadcrumbs heading={t('Variables')} links={[{}]} sx={{ mb: 3 }} />

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1} mb={1}>
          <Grid item xs={6} md={3}>
            <Typography variant="h5">{t('New Variable:')}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <RHFTextField name="name" label={t('Name')} placeholder={t('Name')} />
          </Grid>
          <Grid item xs={6} md={3}>
            <CustomAutocompleteView
              name="type"
              label={t('Type')}
              placeholder={t('Type')}
              items={VARIABLE_TYPES.map((item) => ({
                id: item.value,
                name: t(item.label),
                name_ar: t(item.label),
                name_en: t(item.label),
              }))}
              onCustomChange={(item: ITems) => {
                createQueryString([{ name: 'type', value: item?.id }], true);
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <RHFTextField
              name="value"
              label={t('Value')}
              placeholder={t('Value')}
              disabled={variableType === 'range'}
            />

            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              loading={isLoading}
              fullWidth
              sx={{
                display: 'block',
                width: 'fit-content',
                marginInlineStart: 'auto',
                mt: 1,
                mb: 5,
              }}
            >
              {t('Add')}
            </LoadingButton>
          </Grid>
        </Grid>
      </FormProvider>

      <SharedTable
        additionalComponent={
          <TableHeadActions
            defaultTableHead={TABLE_HEAD}
            setTableHead={(newTableHead: TableHeader[]) => setTableHead(newTableHead)}
            filters={filters.map((item) => ({ ...item, label: t(item.label) }) as TableFilter)}
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
            label: t('Edit'),
            icon: 'solar:pen-bold',
            onClick: (item: Variable) => router.push(paths.dashboard.root),
          },
          {
            label: t('Delete'),
            icon: 'heroicons:trash-solid',
            onClick: (item: Variable) => setDeleteItemId(item.id),
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
