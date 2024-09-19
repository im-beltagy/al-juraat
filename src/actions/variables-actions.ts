'use server';

import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';
import { invalidatePath } from './cache-invalidation';

export const fetchVariables = async (page:number, limit:number): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  try {
    const res = await axiosInstance.get(`${endpoints.variables.list(page, limit)}`, headers);
 //   invalidatePath(`/dashboard`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};


export const addVariable = async (data:{name:string,type:string,maxValue:number|null,values:string[]|null}): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axiosInstance.post(`${endpoints.variables.add()}`,data, headers);
   invalidatePath(`/dashboard`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const editVariable = async (data:{name:string,type:string,maxValue:number|null,values:string[]|null}): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axiosInstance.put(`${endpoints.variables.add()}`,data, headers);
   invalidatePath(`/dashboard`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const deleteVariable = async (id:string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  try {
    const res = await axiosInstance.delete(`${endpoints.variables.delete(id)}`, headers);
    invalidatePath(`/dashboard`);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export async function fetchAllVariables() {
  const lang = cookies().get('Language')?.value;
  const accessToken = cookies().get('accessToken')?.value;

  try {
    const res = await {
      data: [
        {
          name: 'Gender',
          id: 'gender',
          type: 'list',
          options: [
            { id: 'male', name: 'Male' },
            { id: 'female', name: 'Female' },
          ],
        },
        {
          name: 'Age',
          id: 'age',
          type: 'range',
          max_value: 120,
        },
      ],
      meta: {
        itemCount: 3,
      },
    };
    return { data: res?.data, count: res?.meta?.itemCount };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
