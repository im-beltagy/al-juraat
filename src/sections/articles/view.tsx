'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Avatar, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import { useTable } from 'src/components/table';
import { useSettingsContext } from 'src/components/settings';
import SharedTable, { TableHeader } from 'src/components/shared-table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import TableHeadActions, { TableFilter } from 'src/components/shared-table/table-head-actions';

import { Article } from 'src/types/articles';
import { Variable } from 'src/types/variables';
import { getCookie } from 'cookies-next';

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
  const [tableHead, setTableHead] = useState<TableHeader[]>(TABLE_HEAD);

  const additionalTableProps = {
    onRendertitle: (item: Article) => <Typography variant="body2">{item.title || ". . ."}</Typography>,
    onRenderimageUrl: (item: Article) => <Avatar src={`${item.imageUrl}`} />,
    onRendercreationTime: (item: Article) => fDate((item.creationTime as string), 'dd-MM-yyyy'),

  };

  const router = useRouter();

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
        additionalComponent={
          <TableHeadActions
            defaultTableHead={TABLE_HEAD}
          /*   setTableHead={(newTableHead: TableHeader[]) => setTableHead(newTableHead)}
            filters={filters.map((item) => ({ ...item, label: t(item.label) }) as TableFilter)}
            handleExport={() => {}} */
          />
        }
        dataFiltered={articles}
        table={table}
        count={count}
        tableHeaders={tableHead}
        additionalTableProps={additionalTableProps}
        enableActions
        actions={[
          {
            label: t('View'),
            icon: 'mdi:eye',
            onClick: (item: Variable) => router.push(`${paths.dashboard.articles}/${item.id}`),
          },
        ]}
      />
    </Container>
  );
}
