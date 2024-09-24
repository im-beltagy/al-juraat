'use server';

import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';
import { invalidatePath } from './cache-invalidation';

export async function fetchPackages({ page = 1, limit = 5 }: { page?: number; limit?: number }) {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: [
        {
          id: '1',
          name: 'Monthly',
          price: 15,
          duration: 30,
        },
        {
          id: '2',
          name: 'Annual',
          price: 180,
          duration: 365,
        },
      ],
      meta: {
        itemCount: 2,
      },
    };
    return { data: res?.data, count: res?.meta?.itemCount };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}


export const fetchAllPackages = async (page:number, limit:number,search:string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  try {
    const res = await axiosInstance.get(`${endpoints.packages.list(page, limit,search)}`, headers);
 //   invalidatePath(`/dashboard`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const addPackage = async (data:{name:string,price:number,durationInDays:number}): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axiosInstance.post(`${endpoints.packages.add()}`,data, headers);
   invalidatePath(`/packages`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};


export const editPackage = async (id:string,data:{name:string,price:number,durationInDays:number}): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axiosInstance.put(`${endpoints.packages.edit(id)}`,data, headers);
   invalidatePath(`/packages`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};


export const deletePackage = async (id:string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  try {
    const res = await axiosInstance.delete(`${endpoints.packages.delete(id)}`, headers);
    invalidatePath(`/packages`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
