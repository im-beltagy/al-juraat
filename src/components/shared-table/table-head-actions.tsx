'use client';

import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import { Stack } from '@mui/system';
import { Button, Switch, FormControlLabel } from '@mui/material';

import { useDebounce } from 'src/hooks/use-debounce';
import { useQueryString } from 'src/hooks/use-queryString';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import { usePopover } from 'src/components/custom-popover';
import FormProvider from 'src/components/hook-form/form-provider';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import CustomAutocompleteView, { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';

import { TableHeader } from '.';

// ----------------------------------------------------------------------

interface DefaultTableHead {
  id: string;
  label: string;
  static?: boolean;
}

interface ColumnsProps {
  defaultTableHead: DefaultTableHead[];
  setTableHead: (newTableHead: TableHeader[]) => void;
}

type FilterTypes = 'text' | 'number' | 'list';
export interface TableFilter {
  label: string;
  name: string;
  type: FilterTypes;
  options?: { label: string; value: string }[];
}

interface FiltersProps {
  filters: TableFilter[];
}

interface Props extends Partial<ColumnsProps & FiltersProps> {
  handleExport?: VoidFunction;
}

export default function TableHeadActions({
  defaultTableHead,
  setTableHead,
  filters,
  handleExport,
}: Props) {
  const { t } = useTranslate();

  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={1}>
      {/* Columns */}
      {defaultTableHead && !!setTableHead ? (
        <ColumnsAction defaultTableHead={defaultTableHead} setTableHead={setTableHead} />
      ) : null}

      {/* Filters */}
      {filters ? <FiltersAction filters={filters} /> : null}

      {/* Export */}
      {handleExport ? (
        <Button onClick={() => {}} startIcon={<Iconify icon="hugeicons:cloud-download" />}>
          {t('Export')}
        </Button>
      ) : null}
    </Stack>
  );
}

function ColumnsAction({ defaultTableHead, setTableHead }: ColumnsProps) {
  const { t } = useTranslate();

  const columnsPopover = usePopover();

  // Checkboxes
  const [currentTableHeads, setCurrentTableHeads] = useState(
    defaultTableHead?.map((item) => ({ ...item, active: true })) || []
  );

  // Handle checkboxes
  const handleCheckColumn = useCallback((id: string) => {
    setCurrentTableHeads((prev) =>
      prev.map((item) => ({
        ...item,
        active: item.id === id ? !item.active : item.active,
      }))
    );
  }, []);

  // Remove inActive columns
  useEffect(() => {
    setTableHead(
      currentTableHeads
        .filter((col: any) => col.active)
        .map(
          (col: any) =>
            ({ label: col.label, id: col.id, align: col.align }) as unknown as TableHeader
        )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTableHeads]);

  return (
    <>
      <Button onClick={columnsPopover.onOpen} startIcon={<Iconify icon="solar:eye-linear" />}>
        {t('Columns')}
      </Button>
      <CustomPopover open={columnsPopover.open} onClose={columnsPopover.onClose} arrow="top-center">
        <Stack spacing={1} p={1} minWidth="min(15rem, 90vw)">
          {currentTableHeads.map((column) => (
            <FormControlLabel
              control={
                <Switch
                  checked={column.active}
                  disabled={column.static}
                  onChange={() => handleCheckColumn(column.id)}
                />
              }
              label={column.label}
            />
          ))}
        </Stack>
      </CustomPopover>
    </>
  );
}

function FiltersAction({ filters }: FiltersProps) {
  const { t } = useTranslate();

  const filtersPopover = usePopover();

  const { createQueryString } = useQueryString();

  const searchParams = useSearchParams();

  const [currentFilter, setCurrentFilter] = useState<TableFilter | undefined>(
    filters.find((filter) => searchParams.get(filter.name))
  );
  const [lastFilter, setLastFilter] = useState<TableFilter | undefined>(undefined);

  const [currentValue, setCurrentValue] = useState<any>(
    searchParams.get(currentFilter?.name || '')
  );

  const value = useDebounce(currentValue, 500);

  useEffect(() => {
    const queries: any[] = [];
    if (currentFilter) {
      queries.push({ name: currentFilter?.name, value });
    }
    if (lastFilter) {
      queries.push({ name: lastFilter?.name, value: undefined });
    }
    createQueryString(queries);
  }, [createQueryString, currentFilter, lastFilter, value]);

  const renderFilter = useCallback(
    (filter: TableFilter) => {
      switch (filter.type) {
        case 'text':
          return (
            <RHFTextField
              name={filter.name}
              label={t('Value')}
              value={currentValue || ''}
              onChange={(e) => setCurrentValue(e.target.value)}
            />
          );
        case 'number':
          return (
            <RHFTextField
              name={filter.name}
              label={t('Value')}
              value={currentValue || ''}
              type="number"
              onChange={(e) => setCurrentValue(e.target.value)}
            />
          );
        case 'list':
          return (
            <CustomAutocompleteView
              label={t('Value')}
              placeholder=""
              name={filter.name}
              items={
                filter.options?.map((item) => ({
                  id: item.value,
                  name: item.label,
                  name_ar: item.label,
                  name_en: item.label,
                })) as ITems[]
              }
              onCustomChange={(item: any) => {
                setCurrentValue(item?.id);
              }}
            />
          );
        default:
          return <></>;
      }
    },
    [currentValue, t]
  );

  const methods = useForm({
    defaultValues: {
      filter: currentFilter,
    },
  });

  return (
    <>
      <Button onClick={filtersPopover.onOpen} startIcon={<Iconify icon="iconoir:filter" />}>
        {t('Filters')}
      </Button>
      <CustomPopover
        open={filtersPopover.open}
        onClose={filtersPopover.onClose}
        arrow="top-center"
        sx={{ width: 'min(15rem, 90vw)' }}
      >
        <FormProvider methods={methods}>
          <Stack spacing={1} p={1}>
            <CustomAutocompleteView
              label={t('Filter')}
              placeholder=""
              name="filter"
              items={filters.map((item) => ({
                id: item.name,
                name: item.label,
                name_ar: item.label,
                name_en: item.label,
              }))}
              onCustomChange={(item: any) => {
                setCurrentValue(undefined);
                if (item?.id) {
                  setCurrentFilter((prev) => {
                    setLastFilter(prev);
                    return filters.find((f) => f.name === item.id);
                  });
                } else {
                  setCurrentFilter((prev) => {
                    setLastFilter(prev);
                    return undefined;
                  });
                }
              }}
            />
            {currentFilter && renderFilter(currentFilter)}
          </Stack>
        </FormProvider>
      </CustomPopover>
    </>
  );
}
