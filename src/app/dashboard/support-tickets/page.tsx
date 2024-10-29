import { fetchTickets } from 'src/actions/support-tickets-actions';

import { SupportTicketsView } from 'src/sections/support-tickets/view/support-tickets-view';

import { SupportTicket } from 'src/types/support-tickets';

type SearchParams = {
  [key in 'page' | 'limit' | 'search']: string | string[] | undefined;
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const page =
    typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const limit =
    typeof searchParams.limit === 'string' ? Number(searchParams.limit) :  5;
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';

  const supportTickets = await fetchTickets(page, limit, search);

  return (
    <SupportTicketsView
      supportTickets={supportTickets?.items as SupportTicket[]}
      count={Number(supportTickets?.totalCount )}
    />
  );
}
