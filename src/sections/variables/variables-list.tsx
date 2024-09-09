'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

import { paths } from 'src/routes/paths';

import { useTable } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import SharedTable, { TableHeader } from 'src/components/shared-table';
import TableHeadActions, { TableFilter } from 'src/components/shared-table/table-head-actions';

import { Variable } from 'src/types/variables';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', static: true },
  { id: 'type', label: 'Type' },
  { id: 'value', label: '(Max) Value' },
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

interface Props {
  variables: Variable[];
  count: number;
}

export function VariablesList({ variables, count }: Props) {
  const table = useTable();

  const [tableHead, setTableHead] = useState<TableHeader[]>(TABLE_HEAD);

  const additionalTableProps = {
    onRendervalue: (item: Variable) => ('max_value' in item ? item.max_value : item.value),
    onRendertype: (item: Variable) => (item.type === 'list' ? 'List' : 'Range'),
  };

  const router = useRouter();

  const [deleteItemId, setDeleteItemId] = useState('');
  const handleConfirmDelete = useCallback(() => {
    console.log(deleteItemId);
    setDeleteItemId('');
  }, [deleteItemId]);
  return (
    <>
      <SharedTable
        additionalComponent={
          <TableHeadActions
            defaultTableHead={TABLE_HEAD}
            setTableHead={(newTableHead: TableHeader[]) => setTableHead(newTableHead)}
            filters={filters.map((item) => ({ ...item, label: item.label }) as TableFilter)}
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
            label: 'Edit',
            icon: 'solar:pen-bold',
            onClick: (item: Variable) => router.push(paths.dashboard.root),
          },
          {
            label: 'Delete',
            icon: 'heroicons:trash-solid',
            onClick: (item: Variable) => setDeleteItemId(item.id),
          },
        ]}
      />

      {deleteItemId && (
        <ConfirmDialog
          open={!!deleteItemId}
          onClose={() => setDeleteItemId('')}
          title="Delete"
          content="delete_confirm"
          handleConfirmDelete={handleConfirmDelete}
        />
      )}
    </>
  );
}
