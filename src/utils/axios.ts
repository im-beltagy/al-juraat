import axios, { AxiosRequestConfig } from 'axios';
import {getCookie} from "cookies-next";
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: "https://api.medicaldosages.com/" });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("access_token");
    const lang = getCookie("lang") || "ar";

    // Attach headers
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

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
    login: 'api/v1/auth/login',
    register: '/api/auth/register',
    refreshToken:`/api/v1/auth/refresh-token`
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
    list: (page:number,limit:number,search:string)=>`api/v1/Admin/users?SkipCount=${limit * (page - 1)}&MaxResultCount=${limit}&FilterByName=${search}`,
    details: (id:string)=>`/api/v1/Admin/users/${id}`,

  },
  variables: {
    list: (page:number,limit:number,search:string)=>`api/v1/Admin/variables?SkipCount=${limit * (page - 1)}&MaxResultCount=${limit}&FilterByName=${search}`,
    delete: (id:string)=>`/api/v1/Admin/variables/${id}`,
    add: () => `/api/v1/Admin/variables`,
    edit: (id:string) => `/api/v1/Admin/variables/${id}`,
  },
  packages: {
    list: (page:number,limit:number,search:string)=>`/api/v1/Admin/packages?SkipCount=${limit * (page - 1)}&MaxResultCount=${limit}&FilterByName=${search}`,
    add: ()=> `/api/v1/Admin/packages`,
    edit: (id:string)=> `/api/v1/Admin/packages/${id}`,
    delete: (id:string)=>`/api/v1/Admin/packages/${id}`,
  },
  articles: {
    list:(page:number, limit:number, search:string)=>`/api/v1/Admin/articles?SkipCount=${limit * (page - 1)}&MaxResultCount=${limit}&Filter=${search}`,
    add:()=> `/api/v1/Admin/articles`,
    delete:(id:string)=> `/api/v1/Admin/articles/${id}`,
    edit:(id:string)=> `/api/v1/Admin/articles/${id}`,
    details:(id:string)=> `/api/v1/Admin/articles/${id}`,
  }
};
