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
 //  const user = JSON.parse(getCookie('user') as string);
  if (!refreshTokenExpireAt) {
    return false;
  }

//  const decoded = jwtDecode(accessToken);
  const TokenExpireAt = new Date(refreshTokenExpireAt);
  const now = new Date();
  const check = TokenExpireAt <  now;
  return !check;
};

// ----------------------------------------------------------------------

export const tokenExpired = (user?: any) => {
  // eslint-disable-next-line prefer-const
  if (!user?.accessTokenExpireAt) {
    return;
  }
//const user_ = JSON.parse(JSON.stringify(getCookie('user')));
console.log(user) ;
const TokenExpireAt = new Date(user?.accessTokenExpireAt) ;
  const refreshTokenExpireAt = new Date(user?.refreshTokenExpireAt) ;
  const now = new Date();


    if(now < refreshTokenExpireAt) {
      if (now > TokenExpireAt) {
        refreshToken(user?.refreshToken ) ;
      //  window.location.reload()
      }
    }else {
      alert('Token expired');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');
      deleteCookie("accessToken");
      deleteCookie("user");
      window.location.href = paths.auth.jwt.login;
    }
  //  setTimeout(tokenExpired, 2 * 60 * 1000);


};

// ----------------------------------------------------------------------

export const setSession = (accessToken: string , user:any) => {


  sessionStorage.setItem('accessToken', accessToken  );

  if (accessToken  ) {


    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    // This function below will handle when token is expired
   // const { exp } = jwtDecode(accessToken); // ~3 days by minimals server
    tokenExpired(user); // TODO: uncomment this line when deploy
  } else {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    deleteCookie("accessToken");
    deleteCookie("user");

    delete axios.defaults.headers.common.Authorization;
  }
};

export const refreshToken = async (token:string) => {

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

/* function checkTokenExpiration() {
  // Get the current time in milliseconds
  const currentTime = Date.now();

  // Retrieve the token expiration time from local storage (adjust as needed)
  const tokenExpirationTime = localStorage.getItem('tokenExpirationTime');

  // If the token expiration time is not stored, return false (token is considered expired)
  if (!tokenExpirationTime) {
    return false;
  }

  // Parse the token expiration time as a number
  const expirationTime = parseInt(tokenExpirationTime);

  // Check if the current time is past the expiration time
  if (currentTime >= expirationTime) {
    // Token has expired
    return false;
  }

  // Token is not expired, schedule the next check in 2 minutes
  setTimeout(checkTokenExpiration, 2 * 60 * 1000);

  // Return true to indicate that the token is valid
  return true;
} */
