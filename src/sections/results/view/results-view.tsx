'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Grid } from '@mui/material';
import { Container } from '@mui/system';

import { paths } from 'src/routes/paths';

import { useQueryString } from 'src/hooks/use-queryString';

import { useTranslate } from 'src/locales';

import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider from 'src/components/hook-form/form-provider';
import TableHeadActions from 'src/components/shared-table/table-head-actions';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import CustomAutocompleteView, { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';

import { IFinalResult } from 'src/types/results';

const TABLE_HEAD = [
  { id: 'medicine', label: 'Scientific name' },
  { id: 'formula', label: 'Formula' },
  { id: 'indication', label: 'Indication' },
];

interface Props {
  results: IFinalResult[];
  count: number;
  medicines: ITems[];
  formulas: ITems[];
  indications: ITems[];
  variables: ITems[];
}

export default function ResultsView({
  results,
  count,
  medicines,
  formulas,
  indications,
  variables,
}: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();

  const { createQueryString } = useQueryString();

  const searchParams = useSearchParams();

  const methods = useForm({
    defaultValues: {
      medicine: medicines.find((item) => item.id === searchParams.get('medicine')) || undefined,
      formula: formulas.find((item) => item.id === searchParams.get('formula')) || undefined,
      indication:
        indications.find((item) => item.id === searchParams.get('indication')) || undefined,
      variable: variables.find((item) => item.id === searchParams.get('variable')) || undefined,
    },
  });

  const table = useTable();

  const additionalTableProps = useMemo(
    () => ({
      onRendermedicine: (item: IFinalResult) => item.medicine.name,
      onRenderformula: (item: IFinalResult) => item.formula.name,
      onRenderindication: (item: IFinalResult) => item.indication.name,
    }),
    []
  );

  const router = useRouter();

  const [deleteItemId, setDeleteItemId] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const handleConfirmDelete = useCallback(() => {
    try {
      enqueueSnackbar('Deleted Successfully', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Faild to delete', { variant: 'error' });
    } finally {
      setDeleteItemId('');
    }
  }, [enqueueSnackbar]);

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs heading={t('Final Results')} links={[{}]} sx={{ mb: 3 }} />

      <FormProvider methods={methods}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <CustomAutocompleteView
              name="medicine"
              label={t('Scientific name')}
              placeholder={t('Scientific name')}
              items={medicines}
              onCustomChange={(item) => {
                createQueryString([{ name: 'medicine', value: item.id }], true);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomAutocompleteView
              name="formula"
              label={t('Formula')}
              placeholder={t('Formula')}
              items={formulas || []}
              onCustomChange={(item) => {
                createQueryString([{ name: 'formula', value: item.id }], true);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomAutocompleteView
              name="indication"
              label={t('Indication')}
              placeholder={t('Indication')}
              items={indications || []}
              onCustomChange={(item) => {
                createQueryString([{ name: 'indication', value: item.id }], true);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomAutocompleteView
              name="variable"
              label={t('Variable')}
              placeholder={t('Variable')}
              items={variables.map(
                (item) => ({ ...item, name_ar: item.name, name_en: item.name }) as ITems
              )}
              onCustomChange={(item) => {
                createQueryString([{ name: 'variable', value: item.id }], true);
              }}
            />
          </Grid>
        </Grid>
      </FormProvider>

      <SharedTable
        additionalComponent={<TableHeadActions handleExport={() => {}} />}
        dataFiltered={results}
        table={table}
        count={count}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        enableActions
        actions={[
        /*   {
            label: t('View Trade names'),
            icon: 'mdi:eye',
            onClick: (item: IFinalResult) =>
              router.push(`${paths.dashboard.results.tradeNames.root}/${item.id}`),
          }, */
          {
            label: t('Details'),
            icon: 'mdi:eye',
            onClick: (item: IFinalResult) =>
              router.push(
                `${paths.dashboard.calculation.finalResult}&medicine=${item.medicine.id}&indication=${item.indication.id}&formula=${item.formula.id}`
              ),
          },
          {
            label: t('Delete'),
            icon: 'heroicons:trash-solid',
            onClick: (item: IFinalResult) => setDeleteItemId(item.id),
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
