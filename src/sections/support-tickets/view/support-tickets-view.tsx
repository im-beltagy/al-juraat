'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Container } from '@mui/system';

import { paths } from 'src/routes/paths';

import { useTable } from 'src/components/table';
import { useSettingsContext } from 'src/components/settings';
import SharedTable, { TableHeader } from 'src/components/shared-table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import TableHeadActions, { TableFilter } from 'src/components/shared-table/table-head-actions';

import { SupportTicket } from 'src/types/support-tickets';

const TABLE_HEAD = [
  { id: 'title', label: 'Title', static: true },
  { id: 'user_name', label: 'User Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'subject', label: 'Subject' },
];

const filters: TableFilter[] = [
  { name: 'user_name', label: 'User Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'phone', label: 'Phone', type: 'text' },
  { name: 'subject', label: 'Subject', type: 'text' },
];

interface Props {
  supportTickets: SupportTicket[];
  count: number;
}

export function SupportTicketsView({ supportTickets, count }: Props) {
  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable();

  const [tableHead, setTableHead] = useState<TableHeader[]>(TABLE_HEAD);

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs heading="Support Tickets" links={[{}]} sx={{ mb: 3 }} />

      <SharedTable
        additionalComponent={
          <TableHeadActions
            defaultTableHead={TABLE_HEAD}
            setTableHead={(newTableHead: TableHeader[]) => setTableHead(newTableHead)}
            filters={filters.map((item) => ({ ...item, label: item.label }) as TableFilter)}
            handleExport={() => {}}
          />
        }
        dataFiltered={supportTickets}
        table={table}
        count={count}
        tableHeaders={tableHead}
        additionalTableProps={{}}
        enableActions
        actions={[
          {
            label: 'View',
            icon: 'mdi:eye',
            onClick: (item: SupportTicket) =>
              router.push(`${paths.dashboard.supportTickets}/${item.id}`),
          },
        ]}
      />
    </Container>
  );
}
