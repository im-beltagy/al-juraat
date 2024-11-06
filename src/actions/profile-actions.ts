'use server';

import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';
import { invalidatePath } from './cache-invalidation';

export const fetchProfile = async (): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  try {
    const res = await axiosInstance.get(`${endpoints.profile.fetch()}`, headers);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};



export const editPhoneAndName= async (data:any): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'

    }
  };
  try {
    const res = await axiosInstance.put(`${endpoints.profile.edit()}`,data, headers);
//   invalidatePath(`/profile`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};


export const verifyPhoneAndName= async (data:any): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data'

    }
  };
  try {
    const res = await axiosInstance.put(`${endpoints.profile.verifyPhone()}`,data, headers);
  invalidatePath(`/profile`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};



export const editEmail= async (data:any): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data'

    }
  };
  try {
    const res = await axiosInstance.put(`${endpoints.profile.editEmail()}`,data, headers);
//   invalidatePath(`/profile`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};


export const verifyEmail = async (data:any): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data'

    }
  };
  try {
    const res = await axiosInstance.put(`${endpoints.profile.verifyEmail()}`,data, headers);
  invalidatePath(`/profile`);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
