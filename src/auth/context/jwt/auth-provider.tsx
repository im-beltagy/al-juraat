'use client';

import Cookie from 'js-cookie';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { IUser } from 'src/@types/user';

import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';
import { USER_KEY, ACCESS_TOKEN } from '../../constants';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';

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
      const accessToken = sessionStorage.getItem(ACCESS_TOKEN);
      const user: IUser | {} = sessionStorage.getItem(USER_KEY) ?? {};

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

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
      username,
      password,
    };

    const res: { data: any } = {
      data: {
        id: '1fade818-7c9a-4736-9deb-d424af31ebe1',
        account: '15922046',
        name: null,
        avatar: 'https://symlink.live/api//v1/null',
        username: 'nahakygozo@mailinator.com',
        email: 'nahakygozo@mailinator.com',
        email_verified_at: null,
        phone: null,
        phone_verified_at: null,
        role: 'CLIENT',
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5haGFreWdvem9AbWFpbGluYXRvci5jb20iLCJzdWIiOiIxZmFkZTgxOC03YzlhLTQ3MzYtOWRlYi1kNDI0YWYzMWViZTEiLCJpYXQiOjE3MTUxNDYyOTYsImV4cCI6MTczMDY5ODI5Nn0.5mK1zKeYt7Askn7CCpnuvDZlouWm3zbcxMpLJH_pUGE',
      },
    };

    const { data } = res;
    const accessToken = res.data?.access_token;
    setSession(accessToken);
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
    setSession(null);
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
