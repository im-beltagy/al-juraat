'use client';

import { useRouter } from 'next/navigation';

import { Container } from '@mui/system';

import { paths } from 'src/routes/paths';

import { useTable } from 'src/components/table';
import SharedTable from 'src/components/shared-table';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { SupportTicket } from 'src/types/support-tickets';

const TABLE_HEAD = [
  { id: 'title', label: 'Title', static: true },
  { id: 'name', label: 'User Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
];

interface Props {
  supportTickets: SupportTicket[];
  count: number;
}

export function SupportTicketsView({ supportTickets, count }: Props) {
  const settings = useSettingsContext();
  const router = useRouter();

  const table = useTable();

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
        dataFiltered={supportTickets}
        table={table}
        count={count}
        tableHeaders={TABLE_HEAD}
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
