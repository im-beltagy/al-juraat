'use client';

import Cookie from 'js-cookie';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { IUser } from 'src/@types/user';

import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';
import { USER_KEY, ACCESS_TOKEN } from '../../constants';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';
import { deleteCookie, getCookie } from 'cookies-next';

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
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
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
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
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
      "phoneNumber": "+20123456",
      "role": "admin",
      "password": "Admin@12345"
    };
  /*   const res = {
      id: "748b4681-4ca2-4f3d-99ad-e6f75b546e2a",
      name: "admin",
      phoneNumber: "+20123456",
      email: "admin@Medical.com",
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NDhiNDY4MS00Y2EyLTRmM2QtOTlhZC1lNmY3NWI1NDZlMmEiLCJqdGkiOiI3MThkZGE3Ni1hZmNkLTQyNTUtYmU2Ni1jYTVmODIzYjM4ZWMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9tb2JpbGVwaG9uZSI6IisyMDEyMzQ1NiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImFkbWluIiwiZXhwIjoxNzI2NDg3NzcxLCJpc3MiOiJNZWRpY2FsRG9zZXMiLCJhdWQiOiJNZWRpY2FsRG9zZXMifQ.GGiM2YIiIc_rHic_rGgmCjtPfbUc9Sym-PpCMUmGP6Y",
      refreshToken: "7KvyyKGhICkd+U4cqdU6QdsCI2Fdkc+ZOh0lFnfq13k=",
      accessTokenTtlInMinutes: 30,
      refreshTokenExpiraAt: "2024-09-25T08:55:21.5516416"
    }; */



   const res = await axios.post(endpoints.auth.login,credentials );
    const accessToken = res.data?.accessToken;
    const {data} = res;
    setSession(accessToken, data);
   axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    sessionStorage.setItem(USER_KEY, JSON.stringify(data));
    Cookie.set(ACCESS_TOKEN, accessToken);
    Cookie.set(USER_KEY, JSON.stringify(data));
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
    setSession(null, null);
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
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
