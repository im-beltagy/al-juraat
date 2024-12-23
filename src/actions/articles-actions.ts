'use server';

import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

import { invalidatePath } from './cache-invalidation';

export const fetchArticles = async (page: number, limit: number, search: string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };
  try {
    const res = await axiosInstance.get(`${endpoints.articles.list(page, limit, search)}`, headers);
    //   invalidatePath(`/dashboard/users/`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const fetchSingleArticle = async (id: string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };
  try {
    const res = await axiosInstance.get(`${endpoints.articles.details(id)}`, headers);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const editArticle = async (id: string, data: FormData): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  try {
    await axiosInstance.put(endpoints.articles.edit(id), data, headers);
    invalidatePath(`/articles`);

    return {};
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const addArticle = async (data: FormData): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  try {
    await axiosInstance.post(endpoints.articles.add(), data, headers);
    return {};
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const deleteArticle = async (id: string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };
  try {
    await axiosInstance.delete(`${endpoints.articles.delete(id)}`, headers);
    invalidatePath(`/articles`);

    return {};
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
