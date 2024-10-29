'use server';

import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';
import { invalidatePath } from './cache-invalidation';



export const fetchTickets = async (page:number, limit:number,search:string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  try {
    const res = await axiosInstance.get(`${endpoints.support.list(page,limit,search)}`, headers);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};


export const fetchSingleTicket= async (id:string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  try {
    const res = await axiosInstance.get(`${endpoints.support.details(id)}`, headers);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};


export const editAnswer = async (id:string,data:string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axiosInstance.put(`${endpoints.support.edit(id)}`,data, headers);
   invalidatePath(`/dashboard/support-tickets/${id}`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
