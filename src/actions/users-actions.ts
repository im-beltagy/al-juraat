'use server';

import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';




export const fetchUsers = async (page:number, limit:number, search:string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  try {
    const res = await axiosInstance.get(`${endpoints.users.list(page, limit, search)}`, headers);
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
