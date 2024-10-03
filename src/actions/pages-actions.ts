'use server';

import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';
import { invalidatePath } from './cache-invalidation';



export const fetchPrivacy = async (): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  try {
    const res = await axiosInstance.get(`${endpoints.privacyPolicy()}`, headers);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const editPrivacy = async (data:{description:string}): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': `application/json`
    }
  };
  try {

    const res = await axiosInstance.put(endpoints.privacyPolicy(),data, headers);
    invalidatePath(`/privacy-policy`);

  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};



export const fetchTerms = async (): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  try {
    const res = await axiosInstance.get(`${endpoints.termsAndConditions()}`, headers);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const editTerms = async (data:{description:string}): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': `application/json`
    }
  };
  try {

    const res = await axiosInstance.put(endpoints.termsAndConditions(),data, headers);
    invalidatePath(`/terms-and-conditions`);

  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};


export const fetchAbout = async (): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  try {
    const res = await axiosInstance.get(`${endpoints.aboutUs()}`, headers);
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const editAbout = async (data:{description:string}): Promise<any> => {
  const access_token = getCookie('accessToken', { cookies });
  const headers = {

    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': `application/json`
    }
  };
  try {

    const res = await axiosInstance.put(endpoints.aboutUs(),data, headers);
    invalidatePath(`/about-us`);

  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
