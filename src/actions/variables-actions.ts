'use server';

import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

import { invalidatePath } from './cache-invalidation';

export const fetchVariables = async (page: number, limit: number, search: string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };
  try {
    const res = await axiosInstance.get(
      `${endpoints.variables.list(page, limit, search)}`,
      headers
    );
    //   invalidatePath(`/dashboard`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const addVariable = async (data: {
  name: string;
  type: string;
  maxValue: number | null;
  values: string[] | null;
}): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axiosInstance.post(`${endpoints.variables.add()}`, data, headers);
    invalidatePath(`/dashboard`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const editVariable = async (
  id: string,
  data: { name: string; type: string; maxValue: number | null; values: string[] | null }
): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axiosInstance.put(`${endpoints.variables.edit(id)}`, data, headers);
    invalidatePath(`/dashboard`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const deleteVariable = async (id: string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };
  try {
    await axiosInstance.delete(`${endpoints.variables.delete(id)}`, headers);
    invalidatePath(`/dashboard`);

    return {};
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
