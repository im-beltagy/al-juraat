'use server';

import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';
import { invalidatePath } from './cache-invalidation';



export const fetchTradeNames = async (id:string, page:number, limit:number): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  try {
    const res = await axiosInstance.get(`${endpoints.tradeNames.list(id,page,limit)}`, headers);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};


export const addTradeNames = async (data:any): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data'
    }
  };
  try {
    const res = await axiosInstance.post(`${endpoints.tradeNames.add()}`,data, headers);
   invalidatePath(`/medicine/trade-names/`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};


export const fetchSingleTradeName = async (id:string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,

    }
  };
  try {
    const res = await axiosInstance.get(`${endpoints.tradeNames.details(id)}`, headers);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};


export const editTradeNames = async (id:string,data:any): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data'
    }
  };
  try {
    const res = await axiosInstance.post(`${endpoints.tradeNames.edit(id)}`,data, headers);
   invalidatePath(`/medicine/trade-names/`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};


export const deleteTradeName = async (id:string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  try {
    const res = await axiosInstance.delete(`${endpoints.tradeNames.delete(id)}`, headers);
    invalidatePath(`/medicine/trade-names/`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
