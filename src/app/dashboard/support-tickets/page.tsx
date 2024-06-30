import { fetchSupportTickets } from 'src/actions/support-tickets-actions';

import { SupportTicketsView } from 'src/sections/support-tickets/view/support-tickets-view';

import { SupportTicket } from 'src/types/support-tickets';

type SearchParams = {
  [key in 'page' | 'limit' | 'search']: string | string[] | undefined;
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const page =
    typeof searchParams.page === 'string' ? Number(searchParams.page) || undefined : undefined;
  const limit =
    typeof searchParams.limit === 'string' ? Number(searchParams.limit) || undefined : undefined;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  const supportTickets = await fetchSupportTickets({ page, limit, search });

  return (
    <SupportTicketsView
      supportTickets={(supportTickets?.data || []) as unknown as SupportTicket[]}
      count={Number(supportTickets?.count)}
    />
  );
}
