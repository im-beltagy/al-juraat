import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

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
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      {
        subheader: t('Management'),
        items: [
          {
            title: t('Variables'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          {
            title: t('Calculation'),
            path: paths.dashboard.calculation.root,
            icon: ICONS.calculation,
          },
          {
            title: t('Results'),
            path: paths.dashboard.results.root,
            icon: ICONS.results,
          },
          {
            title: t('Users'),
            path: paths.dashboard.users,
            icon: ICONS.users,
          },
          {
            title: t('Packages'),
            path: paths.dashboard.packages,
            icon: ICONS.packages,
          },
          {
            title: t('Privacy Policy'),
            path: paths.dashboard.privacyPolicy,
            icon: ICONS.packages,
          },
          {
            title: t('Terms And Conditions'),
            path: paths.dashboard.termsAndConditions,
            icon: ICONS.packages,
          },
          {
            title: t('Support-Tickets'),
            path: paths.dashboard.supportTickets,
            icon: ICONS.packages,
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
