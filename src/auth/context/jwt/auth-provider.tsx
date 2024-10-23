'use client';

import Cookie from 'js-cookie';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { IUser } from 'src/@types/user';

import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';
import { USER_KEY, ACCESS_TOKEN } from '../../constants';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
  FORGOT = 'FORGOT'
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.FORGOT]: {
    phone: string;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
  phone: ''
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
      phone:''
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.FORGOT) {
    return {
      ...state,
      phone: action.payload.phone,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Readonly<Props>) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
     const lang: string = Cookie.get('Language') || 'en';
       Cookie.set('Language', lang);
      const accessToken = getCookie(ACCESS_TOKEN);
      const user = JSON.parse(getCookie(USER_KEY) as string) ?? {};
      if (accessToken && isValidToken(user?.refreshTokenExpireAt)) {
       setSession(accessToken, user);

        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              ...user,
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (username: string, password: string) => {
    const credentials = {
      "email":username ,// "20123456",
      "role": "admin",
      "password": password //"Admin@12345"
    };

   const res = await axios.post(endpoints.auth.login,credentials );
    const accessToken = res.data?.accessToken;
    const {data} = res;
    setSession(accessToken, data);
   axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    sessionStorage.setItem(USER_KEY, JSON.stringify(data));
    setCookie(ACCESS_TOKEN, accessToken,{sameSite:'strict', secure: true});
   setCookie(USER_KEY, JSON.stringify(data),{sameSite:'strict', secure: true});
    dispatch({
      type: Types.LOGIN,
    payload: {
        user: {
          ...data,
          accessToken,
        },
      },
    });
  }, []);
  const forgot = useCallback(async (phone: string) => {
    sessionStorage.setItem('verify_phone', JSON.stringify(phone))
    const credentials = {
      "phoneNumber":phone ,// "20123456"   20123456  admin  Admin@12345,
      "role": "admin",

    };

   const res = await axios.post(endpoints.auth.forgot,credentials );
   const {data} = res;

  }, []);
  const verify = useCallback(async (code:string) => {
    const savedPhone = JSON.parse(sessionStorage.getItem('verify_phone') as string)
    const credentials = {
      "phoneNumber": state.phone || savedPhone,
      "code":code
    };

    const res = await axios.post(endpoints.auth.verify,credentials );
    const {data} = res;
    sessionStorage.setItem('resetToken', JSON.stringify(data?.token));
    console.log(data)
  }, []);

  const changePassword = useCallback(async ( password: string) => {
    const credentials = {
      "newPassword": password
    };
    const getResetToken = JSON.parse(sessionStorage.getItem('resetToken') as string)
    const headers = {
      headers: {

        'Authorization': `Bearer ${getResetToken}`
      }
    }
    const res = await axios.post(endpoints.auth.newPassword,credentials,headers );
    const {data} = res;
     sessionStorage.removeItem('resetToken');
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const data = {
        email,
        password,
        firstName,
        lastName,
      };

      const res = await axios.post(endpoints.auth.register, data);

      const { accessToken, user } = res.data;

      sessionStorage.setItem(ACCESS_TOKEN, accessToken);

      dispatch({
        type: Types.REGISTER,
        payload: {
          user: {
            ...user,
            accessToken,
          },
        },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    setSession('', null);
    deleteCookie('accessToken');
    deleteCookie('user')
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      phone:state.phone,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      forgot,
      verify,
      changePassword,
      logout,

    }),
    [login, logout,forgot, verify,changePassword, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
