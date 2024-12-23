'use server';

import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

import { invalidatePath } from './cache-invalidation';

export const fetchAllPackages = async (
  page: number,
  limit: number,
  search: string
): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };
  try {
    const res = await axiosInstance.get(`${endpoints.packages.list(page, limit, search)}`, headers);
    //   invalidatePath(`/dashboard`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const addPackage = async (data: {
  name: string;
  price: number;
  durationInDays: number;
}): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axiosInstance.post(`${endpoints.packages.add()}`, data, headers);
    invalidatePath(`/packages`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const editPackage = async (
  id: string,
  data: { name: string; price: number; durationInDays: number }
): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axiosInstance.put(`${endpoints.packages.edit(id)}`, data, headers);
    invalidatePath(`/packages`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const deletePackage = async (id: string): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
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
