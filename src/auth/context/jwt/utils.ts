import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { paths } from 'src/routes/paths';
import axiosInstance, { endpoints } from 'src/utils/axios';

import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

function jwtDecode(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (refreshTokenExpireAt: string) => {
 // const user = JSON.parse(getCookie('user') as string);
  if (!refreshTokenExpireAt) {
    return false;
  }

//  const decoded = jwtDecode(accessToken);
const TokenExpireAt = new Date(refreshTokenExpireAt);
const now = new Date();
console.log(TokenExpireAt <  now, 'e')
  if(TokenExpireAt < now) {
    refreshToken('ert')
  }
  return TokenExpireAt <  now;
};

// ----------------------------------------------------------------------

export const tokenExpired = (accessTokenExpireAt: string) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;
  if (!accessTokenExpireAt) {
    return;
  }
  const TokenExpireAt = new Date(accessTokenExpireAt);
  const now = new Date();
  console.log(TokenExpireAt <  now, 'c')

  clearTimeout(expiredTimer);
  if (TokenExpireAt < now) {
    expiredTimer = setTimeout(() => {
      alert('Token expired');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');
      deleteCookie("accessToken");
      deleteCookie("user");
      window.location.href = paths.auth.jwt.login;

    }, 10000);
  }
};

// ----------------------------------------------------------------------

export const setSession = (accessToken: string | null, user:any) => {
  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken);
    const exp = user?.accessTokenExpireAt
    isValidToken(user?.refreshTokenExpireAt)

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    // This function below will handle when token is expired
   // const { exp } = jwtDecode(accessToken); // ~3 days by minimals server
    tokenExpired(exp); // TODO: uncomment this line when deploy
  } else {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    deleteCookie("accessToken");
    deleteCookie("user");

    delete axios.defaults.headers.common.Authorization;
  }
};

export const refreshToken = async (token:string) => {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('user');
  deleteCookie("accessToken");
  deleteCookie("user");
const res = await axiosInstance.post(endpoints.auth.refreshToken, {
  refreshToken: token,
  });
  console.log(res.data);
  const {accessToken } = res.data;
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  sessionStorage.setItem('accessToken', accessToken);
  sessionStorage.setItem('user', res.data);
  setCookie("accessToken", accessToken);
  setCookie("user", res.data);
};

export const getAccessToken = () => {};
