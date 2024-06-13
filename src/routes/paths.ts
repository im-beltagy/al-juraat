const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    calculation: `${ROOTS.DASHBOARD}/calculation`,
    results: `${ROOTS.DASHBOARD}/results`,
    users: `${ROOTS.DASHBOARD}/users`,
    packages: `${ROOTS.DASHBOARD}/packages`,
    privacyPolicy: `${ROOTS.DASHBOARD}/privacy-policy`,
    termsAndConditions: `${ROOTS.DASHBOARD}/terms-and-conditions`,
    supportTickets: `${ROOTS.DASHBOARD}/support-tickets`,
  },
};
