import { paths } from 'src/routes/paths';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  dashboard: icon('ic_order'),
  calculation: icon('ic_blog'),
  results: icon('ic_job'),
  users: icon('ic_tour'),
  packages: icon('ic_folder'),
  articles: icon('ic_file'),
};

// ----------------------------------------------------------------------

const data = [
  {
    subheader: 'Management',
    items: [
      {
        title: 'Variables',
        path: paths.dashboard.root,
        icon: ICONS.dashboard,
      },
      {
        title: 'Calculation',
        path: paths.dashboard.calculation.root,
        icon: ICONS.calculation,
      },
      {
        title: 'Results',
        path: paths.dashboard.results.root,
        icon: ICONS.results,
      },
      {
        title: 'Users',
        path: paths.dashboard.users,
        icon: ICONS.users,
      },
      {
        title: 'Packages',
        path: paths.dashboard.packages,
        icon: ICONS.packages,
      },
      {
        title: 'Articles',
        path: paths.dashboard.articles.root,
        icon: ICONS.articles,
      },
      {
        title: 'Privacy Policy',
        path: paths.dashboard.privacyPolicy,
        icon: ICONS.packages,
      },
      {
        title: 'FAQs',
        path: paths.dashboard.faq,
        icon: ICONS.packages,
      },
      {
        title: 'Support Tickets',
        path: paths.dashboard.supportTickets,
        icon: ICONS.packages,
      },

    ],
  },
];

export function useNavData() {
  return data;
}
