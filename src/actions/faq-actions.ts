'use server';

import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';
import { invalidatePath } from './cache-invalidation';



export const fetchFQA = async (): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  try {
    const res = await axiosInstance.get(`${endpoints.FQA.list()}`, headers);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};



export const editFAQ = async (id:string,data:{question:string,answer:string}): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': `application/json`
    }
  };
  try {

    const res = await axiosInstance.put(endpoints.FQA.edit(id),data, headers);
    invalidatePath(`/faq`);

  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const addFAQ = async (data:{question:string,answer:string}): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': `application/json`
    }
  };
  try {

    const res = await axiosInstance.post(endpoints.FQA.add(),data, headers);
    invalidatePath(`/faq`);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const deleteFQA = async (id:string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`

    }
  };
  try {
    const res = await axiosInstance.delete(`${endpoints.FQA.delete(id)}`, headers);
    invalidatePath(`/faq`);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
