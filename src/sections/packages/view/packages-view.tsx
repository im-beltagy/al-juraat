'use client';

import { useState } from 'react';

import { Container } from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import TableHeadActions, { TableFilter } from 'src/components/shared-table/table-head-actions';

import { Package } from 'src/types/packages';

import PackagesDialog from '../packages-dialog';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'price', label: 'Price' },
  { id: 'durationInDays', label: 'Duration in days' },
];

const filters: TableFilter[] = [{ name: 'duration', label: 'Duration in days', type: 'number' }];

interface Props {
  packages: Package[];
  count: number;
}

export default function PackagesView({ packages, count }: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [choosenPackage, setChoosenPackage] = useState<Package | undefined>(undefined);

  // Table
  const table = useTable();

  const additionalTableProps = { onRenderprice: (item: Package) => fCurrency(item.price) };

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs heading={t('Packages')} links={[{}]} sx={{ mb: 3 }} />

      <SharedTable
        additionalComponent={
          <TableHeadActions

          />
        }
        dataFiltered={packages}
        table={table}
        count={count}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        enableAdd
        custom_add_title={t('Add New Package')}
        handleAdd={() => {
          setChoosenPackage(undefined);
          setIsDialogOpen(true);
        }}
        enableActions
        actions={[
          {
            label: t('Edit'),
            icon: 'solar:pen-bold',
            onClick: (item: Package) => {
              setChoosenPackage(item);
              setIsDialogOpen(true);
            },
          },
        ]}
      />

      {isDialogOpen ? (
        <PackagesDialog
          open={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setChoosenPackage(undefined);
          }}
          choosenPackage={choosenPackage}
        />
      ) : null}
    </Container>
  );
}
