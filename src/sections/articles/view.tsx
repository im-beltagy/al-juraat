'use client';

import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import { Avatar, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { deleteArticle } from 'src/actions/articles-actions';

import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import TableHeadActions from 'src/components/shared-table/table-head-actions';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { Article } from 'src/types/articles';
import { Variable } from 'src/types/variables';

const TABLE_HEAD = [
  { id: 'title', label: 'Title', static: true },
  { id: 'imageUrl', label: 'Image' },
  { id: 'creationTime', label: 'Created At' },
];

interface Props {
  articles: Article[];
  count: number;
}

export default function ArticlesView({ articles, count }: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();
  // Table
  const table = useTable();
  const [deleteItemId, setDeleteItemId] = useState('');

  const additionalTableProps = {
    onRendertitle: (item: Article) => (
      <Typography variant="body2">{item.title || '. . .'}</Typography>
    ),
    onRenderimageUrl: (item: Article) => <Avatar src={`${item.imageUrl}`} />,
    onRendercreationTime: (item: Article) => fDate(item.creationTime as string, 'dd-MM-yyyy'),
  };

  const router = useRouter();
  const handleConfirmDelete = useCallback(async () => {
    const res = await deleteArticle(deleteItemId);
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
      <CustomBreadcrumbs heading={t('Articles')} links={[{}]} sx={{ mb: 3 }} />

      <SharedTable
        additionalComponent={<TableHeadActions defaultTableHead={TABLE_HEAD} />}
        dataFiltered={articles}
        table={table}
        count={count}
        enableAdd
        custom_add_title={t('Add New')}
        handleAdd={() => router.push(paths.dashboard.articles.new)}
        tableHeaders={TABLE_HEAD}
        additionalTableProps={additionalTableProps}
        enableActions
        actions={[
          {
            label: t('Edit'),
            icon: 'solar:pen-bold',
            onClick: (item: Article) => router.push(`${paths.dashboard.articles.edit}/${item.id}`),
          },
          {
            label: t('View'),
            icon: 'mdi:eye',
            onClick: (item: Variable) => router.push(`${paths.dashboard.articles.view}/${item.id}`),
          },
          {
            label: 'Delete',
            icon: 'heroicons:trash-solid',
            onClick: (item: Article) => setDeleteItemId(item.id),
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
    </Container>
  );
}
