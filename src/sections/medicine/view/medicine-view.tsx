'use client';

import { useCallback, useState } from 'react';

import { Container, Typography } from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import TableHeadActions, { TableFilter } from 'src/components/shared-table/table-head-actions';
import FormProvider from 'src/components/hook-form/form-provider';
import { useQueryString } from 'src/hooks/use-queryString';
import { useRouter, useSearchParams } from 'next/navigation';

import { Grid } from '@mui/material';
import { useForm } from 'react-hook-form';

// import PackagesDialog from '../packages-dialog';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { enqueueSnackbar } from 'notistack';
import { deletePackage } from 'src/actions/packages-actions';
import { Medicine } from 'src/types/medicine';
import CustomAutocompleteView, { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';
import RHFTextField from 'src/components/hook-form/rhf-text-field2';

const TABLE_HEAD = [
  { id: 'scientificName', label: 'Scientific Name' },
  { id: 'indication', label: 'Indication' },
  { id: 'formula', label: 'Formula' },
  { id: 'pharmacologicalGroup', label: 'Pharmacological Group' },

];

const filters: TableFilter[] = [{ name: 'duration', label: 'Duration in days', type: 'number' }];

interface Props {
  medicines: Medicine[];
  count: number;
}

export default function MedicineView({ medicines, count }: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();
  const [deleteItemId, setDeleteItemId] = useState('');
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [choosenPackage, setChoosenPackage] = useState<Medicine | undefined>(undefined);

  const { createQueryString } = useQueryString();

  const searchParams = useSearchParams();
  // Table
  const table = useTable();

  const methods = useForm({
    defaultValues: {
      scientific_name: '',
      formula: '' ,
      indication:'' ,
      pharmacological_group: '' ,
    },
  });

  const {
    setValue,
    getValues
  } = methods;
  const additionalTableProps = {
     onRenderindication: (item: Medicine) => <Typography sx={{overflow: "hidden", textOverflow: "ellipsis", width: '150px'}} variant="body2">{item?.indication}</Typography>,
     onRenderpharmacologicalGroup: (item: Medicine) => <Typography sx={{overflow: "hidden", textOverflow: "ellipsis", width: '150px'}} variant="body2">{item?.pharmacologicalGroup}</Typography>

    };
  const handleConfirmDelete = useCallback(async() => {

    const res:any = await deletePackage(deleteItemId);
    console.log(res);

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
      <CustomBreadcrumbs heading={t('Medicine')} links={[{}]} sx={{ mb: 3 }} />
      <FormProvider methods={methods}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
          <RHFTextField
              name="scientific_name"
              label={t('Scientific name')}
              placeholder={t('Scientific name')}
              onChange={(event) => {
                setValue('scientific_name', event.target.value);
                createQueryString([{name:'scientific_name', value:getValues('scientific_name')}], true);
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
                createQueryString([{name:'formula', value:getValues('formula')}], true);
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
                createQueryString([{name:'indication', value:getValues('indication')}], true);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="pharmacological_group"
              label={t('Pharmacological group')}
              placeholder={t('Pharmacological  group')}
              onChange={(event) => {
                setValue('pharmacological_group', event.target.value);
                createQueryString([{name:'pharmacological_group', value:getValues('pharmacological_group')}], true);
              }}
            />
          </Grid>
        </Grid>
      </FormProvider>
      <SharedTable
        additionalComponent={
          <TableHeadActions

          />
        }
        dataFiltered={medicines}
        table={table}
        count={count}
        disablePagination
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        enableAdd
        custom_add_title={t('Add New Medicine')}
        handleAdd={() => {
          setChoosenPackage(undefined);
          setIsDialogOpen(true);
        }}
        enableActions
        actions={[
          {
            label: t('Edit'),
            icon: 'solar:pen-bold',
            onClick: (item: Medicine) => {
              setChoosenPackage(item);
              setIsDialogOpen(true);
            },
          },
          {
            label: 'Delete',
            icon: 'heroicons:trash-solid',
            onClick: (item: Medicine) => setDeleteItemId(item.id),
          },

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
 {/*      {isDialogOpen ? (
        <PackagesDialog
          open={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setChoosenPackage(undefined);
          }}
          choosenPackage={choosenPackage}
        />
      ) : null} */}
    </Container>
  );
}
