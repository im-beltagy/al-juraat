'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

import { paths } from 'src/routes/paths';

import { useTable } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import SharedTable, { TableHeader } from 'src/components/shared-table';
import TableHeadActions, { TableFilter } from 'src/components/shared-table/table-head-actions';

import { IVariable } from 'src/types/variables';
import { Typography } from '@mui/material';
import ViewValuesDialog from 'src/components/dialog/view-values-dialog';
import { deleteVariable } from 'src/actions/variables-actions';
import { enqueueSnackbar } from 'notistack';
import { VariablesEditForm } from './variable-edit';

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
  variables: IVariable[];
  count: number;
}

export function VariablesList({ variables, count }: Props) {
  const table = useTable();

  const [tableHead, setTableHead] = useState<TableHeader[]>(TABLE_HEAD);

  const additionalTableProps = {
    onRendervalue: (item: IVariable) =>  (item?.maxValue ? item?.maxValue : `${item?.values[0]} . . .`),
    onRendertype: (item: IVariable) => (item.type === 'List' ? 'List' : 'Range'),
  };

  const router = useRouter();

  const [deleteItemId, setDeleteItemId] = useState('');
  const [listValues, setListValues] = useState(['']);
  const [openView, setOpenView] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState<any>();
  const [openEdit, setOpenEdit] = useState(false);
  const handleListValuesClose = useCallback(() => {
    setOpenView(false);

    setListValues(['']);
  }, [openView]);
  const handleConfirmDelete = useCallback(async() => {

    const res = await deleteVariable(deleteItemId);
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
    <>
      <SharedTable
        additionalComponent={
          <TableHeadActions
            defaultTableHead={TABLE_HEAD}
           /*  setTableHead={(newTableHead: TableHeader[]) => setTableHead(newTableHead)}
            filters={filters.map((item) => ({ ...item, label: item.label }) as TableFilter)}
            handleExport={() => {}} */
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
            onClick: async(item: IVariable) => {
             await setSelectedVariable(item);
              setOpenEdit(true);
            },
          },
          {
            label: 'Delete',
            icon: 'heroicons:trash-solid',
            onClick: (item: IVariable) => setDeleteItemId(item.id),
          },
          {
            label: 'view',
            icon:'mdi:eye',
            hideActionIf: (item: IVariable) => item?.type === 'List' ? false : true,
            onClick: (item: IVariable) => {
              setListValues(item.values);
              setOpenView(true);
            },
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
          {listValues && (
        <ViewValuesDialog
          open={openView}
          onClose={() => setOpenView(false)}
          title="Values"
          content={listValues}
          handleClose={handleListValuesClose}
        />
      )}
         {selectedVariable?.name && (
        <VariablesEditForm
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          variable={selectedVariable}
        />
      )}
    </>
  );
}
