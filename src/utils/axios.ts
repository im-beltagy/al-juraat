import { getCookie } from 'cookies-next';
import axios, { AxiosRequestConfig } from 'axios';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: 'https://api.medicaldosages.com/' });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('access_token');

    // Attach headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
/* slugs :

privacy_policy
terms_and_conditions
about_us */
// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const getErrorMessage = (error: unknown): string => {
  let message: string;
  if (error instanceof Error) {
    // eslint-disable-next-line prefer-destructuring
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message);
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = 'Something went wrong';
  }
  return message;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/v1/admin/auth/login',
    register: '/api/auth/register',
    forgot: `/api/v1/admin/auth/forget-password`,
    verify: `/api/v1/admin/auth/verify-forget-password-otp`,
    resendOtp: `/api/v1/admin/auth/resend-forget-password-otp`,
    newPassword: `/api/v1/admin/auth/change-password`,
    refreshToken: `/api/v1/auth/refresh-token`,
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  users: {
    list: (page: number, limit: number, search: string) =>
      `api/v1/Admin/users?SkipCount=${
        limit * (page - 1)
      }&MaxResultCount=${limit}&FilterByName=${search}`,
    details: (id: string) => `/api/v1/Admin/users/${id}`,
  },
  variables: {
    list: (page: number, limit: number, search: string) =>
      `api/v1/Admin/variables?SkipCount=${
        limit * (page - 1)
      }&MaxResultCount=${limit}&FilterByName=${search}`,
    single: (id: string) => `/api/v1/Admin/variables/${id}`,
    delete: (id: string) => `/api/v1/Admin/variables/${id}`,
    add: () => `/api/v1/Admin/variables`,
    edit: (id: string) => `/api/v1/Admin/variables/${id}`,
  },
  packages: {
    list: (page: number, limit: number, search: string) =>
      `/api/v1/Admin/packages?SkipCount=${
        limit * (page - 1)
      }&MaxResultCount=${limit}&FilterByName=${search}`,
    add: () => `/api/v1/Admin/packages`,
    edit: (id: string) => `/api/v1/Admin/packages/${id}`,
    delete: (id: string) => `/api/v1/Admin/packages/${id}`,
  },
  articles: {
    list: (page: number, limit: number, search: string) =>
      `/api/v1/Admin/articles?SkipCount=${
        limit * (page - 1)
      }&MaxResultCount=${limit}&Filter=${search}`,
    add: () => `/api/v1/Admin/articles`,
    delete: (id: string) => `/api/v1/Admin/articles/${id}`,
    edit: (id: string) => `/api/v1/Admin/articles/${id}`,
    details: (id: string) => `/api/v1/Admin/articles/${id}`,
  },
  FQA: {
    list: () => `/api/v1/Admin/faqs`,
    delete: (id: string) => `/api/v1/Admin/faqs/${id}`,
    add: () => `/api/v1/Admin/faqs`,
    edit: (id: string) => `/api/v1/Admin/faqs/${id}`,
  },
  profile: {
    fetch: () => `/api/v1/Admin/profile`,
    edit: () => `/api/v1/Admin/profile`,
    verifyPhone: () => `/api/v1/Admin/profile/verify-new-phone`,
    editEmail: () => `/api/v1/Admin/profile/change-email`,
    verifyEmail: () => `/api/v1/Admin/profile/verify-new-email`,
  },
  medicine: {
    list: (
      page: number,
      limit: number,
      scientific_name?: string,
      formula?: string,
      indication?: string,
      pharmacological_group?: string
    ) =>
      `/api/v1/Admin/medicines?SkipCount=${
        limit * (page - 1)
      }&MaxResultCount=${limit}&ScientificName=${scientific_name}&Formula=${formula}&Indication=${indication}&PharmacologicalGroup=${pharmacological_group}`,
    add: () => `/api/v1/Admin/medicines/create`,
    details: (id: string) => `/api/v1/Admin/medicines/${id}`,
    edit: (id: string) => `/api/v1/Admin/medicines/${id}`,
  },
  tradeNames: {
    list: (id: string, page: number, limit: number) =>
      `/api/v1/Admin/tradenames/list/${id}?SkipCount=${limit * (page - 1)}&MaxResultCount=${limit}`,
    add: () => `/api/v1/Admin/tradenames/create`,
    details: (id: string) => `/api/v1/Admin/tradenames/${id}`,
    edit: (id: string) => `/api/v1/Admin/tradenames/${id}`,
    delete: (id: string) => `/api/v1/Admin/tradenames/${id}`,
  },
  tradeNamesImages: {
    add: (tradeNameid: string) => `/api/v1/Admin/tradenames/images/add/${tradeNameid}`,
    edit: (imageid: string) => `/api/v1/Admin/tradenames/images/replace/${imageid}`,
    delete: (imageid: string) => `/api/v1/Admin/tradenames/images/${imageid}`,
  },
  calculation: {
    getScientificNames: () => `/api/v1/Admin/medicines/scientificNames`,
    getIndications: (scientificName: string) =>
      `/api/v1/Admin/medicines/indications?scientificName=${scientificName}`,
    getFormulas: (scientificName: string) =>
      `/api/v1/Admin/medicines/formulas?scientificName=${scientificName}`,
    getDosage: (scientific_name: string, formula: string, indication: string) =>
      `/api/v1/Admin/medicines/dosage?scientificName=${scientific_name}&Indication=${indication}&Formula=${formula}`,
    getVariables: () => `/api/v1/Admin/variables`,
    createEquation: () => `/api/v1/Admin/equations/create`,
    editEquation: () => `/api/v1/Admin/dominalvariables/update`,
    customDosage: () => `/api/v1/Admin/custom-dosages/add`,
    addEquationVariable: (id: string) => `/api/v1/Admin/dominalvariables/add/${id}`,
    getNewDosage: (dosage: number, effect: number, effectType: boolean) =>
      `/api/v1/Admin/dominalvariables/new-dosage?Dosage=${dosage}&Effect=${effect}&EffectType=${effectType}`,
  },
  /* /medicines/dosage?scientificName=dsf&Indication=sdf&Formula=df */
  results: {
    list: (
      page: number,
      limit: number,
      scientific_name?: string,
      formula?: string,
      indication?: string
    ) =>
      `/api/v1/Admin/equations?SkipCount=${
        limit * (page - 1)
      }&MaxResultCount=${limit}&ScientificName=${scientific_name}&Formula=${formula}&Indication=${indication}`,
    details: (id: string) => `/api/v1/Admin/equations/${id}`,
    delete: (id: string) => `/api/v1/Admin/equations/${id}`,
  },
  support: {
    list: (page: number, limit: number, search: string) =>
      `/api/v1/Admin/contact-us?SkipCount=${
        limit * (page - 1)
      }&MaxResultCount=${limit}&Filter=${search}`,
    details: (id: string) => `/api/v1/Admin/contact-us/${id}`,
    edit: (id: string) => `/api/v1/Admin/contact-us/Answer/${id}`,
  },
  privacyPolicy: () => `/api/v1/Admin/pages/privacy_policy`,
  termsAndConditions: () => `/api/v1/Admin/pages/terms_and_conditions`,
  aboutUs: () => `/api/v1/Admin/pages/about_us`,
};
