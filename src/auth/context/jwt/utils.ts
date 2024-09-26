import { deleteCookie, getCookie } from 'cookies-next';
import { paths } from 'src/routes/paths';

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

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;
  console.log(decoded.exp > currentTime , 'llll')
  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp: number) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now() / 1000;
  const now = new Date();
  /*  const timenow = now.getTime();
  const exp_number = Number(new Date(exp)); */
  const logintTime = Number(localStorage.getItem('loginTime'));
  if (!logintTime) {
    return;
  }
  const logoutTime = localStorage.getItem('logoutTime');
  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
 //  const timeLeft =Math.floor( exp_number - currentTime)  ;
  console.log(logoutTime && currentTime > Number(logoutTime))
  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    deleteCookie("accessToken");
    deleteCookie("user");

    window.location.href = paths.auth.jwt.login;

  }, 30000);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken: string | null, user:any) => {
  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken);
    const exp = user?.refreshTokenExpiraAt
   console.log(user, 'here');
   const now = new Date();
   const loginTime = now.getTime();
   localStorage.setItem('loginTime', String(loginTime));
   const logoutTime = now.getTime() + 30000;
   localStorage.setItem('logoutTime', `${logoutTime}`);
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

export const getAccessToken = () => {};
