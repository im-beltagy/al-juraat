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
    calculation: {
      root: `${ROOTS.DASHBOARD}/calculation`,
      selectionOfMedication: `${ROOTS.DASHBOARD}/calculation?step=selection-of-medication`,
      dominalVariables: `${ROOTS.DASHBOARD}/calculation?step=dominal-variables`,
      finalResult: `${ROOTS.DASHBOARD}/calculation?step=final-result`,
      customPatient: `${ROOTS.DASHBOARD}/calculation?step=custom-patient`,
    },
    results: {
      root: `${ROOTS.DASHBOARD}/results`,
      tradeNames: {
        root: `${ROOTS.DASHBOARD}/results/trade-names`,
        new: `${ROOTS.DASHBOARD}/results/trade-names/new`,
        view: `${ROOTS.DASHBOARD}/results/trade-names/view`,
        edit: `${ROOTS.DASHBOARD}/results/trade-names/edit`,
      },
    },
    articles: {
      root:`${ROOTS.DASHBOARD}/articles`,
      new: `${ROOTS.DASHBOARD}/articles/new`,
      view: `${ROOTS.DASHBOARD}/articles/view`,
      edit: `${ROOTS.DASHBOARD}/articles/edit`,
    },
    users: `${ROOTS.DASHBOARD}/users`,
    packages: `${ROOTS.DASHBOARD}/packages`,
    privacyPolicy: `${ROOTS.DASHBOARD}/privacy-policy`,
    termsAndConditions: `${ROOTS.DASHBOARD}/terms-and-conditions`,
    aboutUs: `${ROOTS.DASHBOARD}/about-us`,
    medicine: `${ROOTS.DASHBOARD}/medicine`,
    supportTickets: `${ROOTS.DASHBOARD}/support-tickets`,
    faq: `${ROOTS.DASHBOARD}/faq`,
  },
};
