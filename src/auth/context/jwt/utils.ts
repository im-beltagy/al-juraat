import { getCookie, setCookie, deleteCookie } from 'cookies-next';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export const isValidToken = (refreshTokenExpireAt: string) => {
  //  const user = JSON.parse(getCookie('user') as string);
  if (!refreshTokenExpireAt) {
    return false;
  }

  //  const decoded = jwtDecode(accessToken);
  const TokenExpireAt = new Date(refreshTokenExpireAt);
  const now = new Date();
  const check = TokenExpireAt < now;
  return !check;
};

// ----------------------------------------------------------------------

export const tokenExpired = (user?: any) => {
  let check;
  // eslint-disable-next-line prefer-const
  const storedUser =
    typeof getCookie('user') === 'string' && JSON.parse(getCookie('user') as string);

  if (!user?.accessTokenExpireAt && storedUser) {
    clearInterval(check);
    return;
  }
  const TokenExpireAt = new Date(user?.accessTokenExpireAt || storedUser?.accessTokenExpireAt);
  const refreshTokenExpireAt = new Date(
    user?.refreshTokenExpireAt || storedUser?.refreshTokenExpireAt
  );
  const now = new Date();

  if (now < refreshTokenExpireAt) {
    if (now > TokenExpireAt) {
      refreshToken(user?.refreshToken);
    }
  } else {
    //    alert('Token expired');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    deleteCookie('accessToken');
    deleteCookie('user');
    window.location.href = paths.auth.jwt.login;
  }

  check = setInterval(tokenExpired, 3 * 60 * 1000);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken: string, user: any) => {
  sessionStorage.setItem('accessToken', accessToken);

  if (accessToken) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken); // ~3 days by minimals server
    tokenExpired(user); // TODO: uncomment this line when deploy
  } else {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    deleteCookie('accessToken');
    deleteCookie('user');

    delete axiosInstance.defaults.headers.common.Authorization;
    window.location.href = paths.auth.jwt.login;
  }
};

export const refreshToken = async (token: string) => {
  const res = await axiosInstance.post(endpoints.auth.refreshToken, {
    refreshToken: token,
  });
  const { accessToken } = res.data;
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  sessionStorage.setItem('accessToken', accessToken);
  sessionStorage.setItem('user', JSON.stringify(res.data));
  setCookie('accessToken', accessToken, { sameSite: 'strict', secure: true });
  setCookie('user', JSON.stringify(res.data), { sameSite: 'strict', secure: true });
  window.location.reload();
};

export const getAccessToken = () => {};
