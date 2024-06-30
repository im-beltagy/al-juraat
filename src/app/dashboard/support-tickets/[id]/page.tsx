import { fetchSingleSupportTicket } from 'src/actions/support-tickets-actions';

import { SingleSupportTicketsView } from 'src/sections/support-tickets/view/single-support-ticket-view';

import { SupportTicket } from 'src/types/support-tickets';

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const supportTicket = await fetchSingleSupportTicket({ id });

  return <SingleSupportTicketsView ticket={supportTicket?.data as unknown as SupportTicket} />;
}
