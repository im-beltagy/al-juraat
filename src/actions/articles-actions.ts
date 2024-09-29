'use server';

import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';
import { invalidatePath } from './cache-invalidation';



export const fetchArticles = async (page:number, limit:number, search:string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`
    }
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

export const fetchSingleUser = async (id:string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  try {
    const res = await axiosInstance.get(`${endpoints.users.details(id)}`, headers);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};



export const addArticle = async (data:FormData): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data'
    }
  };
  try {

    const res = await axiosInstance.post(endpoints.articles.add(),data, headers);

  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const deleteArticle = async (id:string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`

    }
  };
  try {
    const res = await axiosInstance.delete(`${endpoints.articles.delete(id)}`, headers);
    invalidatePath(`/articles`);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
