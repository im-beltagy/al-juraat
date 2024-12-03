'use client';

import { usePathname } from 'next/navigation';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import { paths } from 'src/routes/paths';

import axios, { endpoints, getErrorMessage } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { USER_KEY, ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
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
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
  FORGOT = 'FORGOT',
  SESSION = 'SESSION',
}

type Payload = {
  [Types.INITIAL]:
    | undefined
    | {
        user: AuthUserType;
      };
  [Types.FORGOT]: {
    phone: string;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
  [Types.SESSION]: {
    user: AuthUserType;
  };
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
  phone: '',
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload?.user || state.user || null,
      phone: '',
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
  if (action.type === Types.SESSION) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  return state;
};

// ----------------------------------------------------------------------
type User = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
};
type Session = User & {
  accessToken: string;
  refreshToken: string;
  accessTokenExpireAt: string;
  refreshTokenExpireAt: string;
};

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Readonly<Props>) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const pathname = usePathname();

  const logout = useCallback(() => {
    console.log('logout');
    (async () => {
      deleteCookie(USER_KEY);
      deleteCookie(ACCESS_TOKEN);
      deleteCookie(REFRESH_TOKEN);
      dispatch({
        type: Types.LOGOUT,
      });
    })();
  }, []);

  const newSession = useCallback(
    ({
      accessToken,
      accessTokenExpireAt,
      refreshToken,
      refreshTokenExpireAt,
      ...user
    }: Session) => {
      console.log('newSession');
      (async () => {
        setCookie(ACCESS_TOKEN, accessToken, {
          expires: new Date(accessTokenExpireAt),
          sameSite: 'strict',
          secure: true,
        });
        setCookie(REFRESH_TOKEN, refreshToken, {
          expires: new Date(refreshTokenExpireAt),
          sameSite: 'strict',
          secure: true,
        });
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        setCookie(USER_KEY, JSON.stringify(user), { sameSite: 'strict', secure: true });

        dispatch({
          type: Types.SESSION,
          payload: {
            user,
          },
        });

        const handleRefreshToken = async () => {
          try {
            const oldRefreshToken = getCookie(REFRESH_TOKEN);
            const res = await axios.post(endpoints.auth.refreshToken, {
              refreshToken: oldRefreshToken,
            });
            newSession(res.data);
          } catch (error) {
            logout();
          }
        };

        setTimeout(
          () => {
            handleRefreshToken();
          },
          1000 * 60 * 25
        );
      })();
    },
    [logout]
  );

  const initialize = useCallback(() => {
    console.log('initialize');
    const user = getCookie(USER_KEY);
    dispatch({
      type: Types.INITIAL,
      payload: user
        ? {
            user: JSON.parse(user),
          }
        : undefined,
    });
    if (pathname.includes(paths.auth.jwt.login)) {
      return;
    }

    (async () => {
      const oldRefreshToken = getCookie(REFRESH_TOKEN);
      if (!oldRefreshToken) {
        logout();
      }

      try {
        const res = await axios.post(endpoints.auth.refreshToken, {
          refreshToken: oldRefreshToken,
        });
        newSession(res.data);
      } catch (error) {
        logout();
      }
    })();
  }, [logout, newSession, pathname]);

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // LOGIN
  const login = useCallback(
    (username: string, password: string) => {
      (async () => {
        const credentials = {
          email: username, // "20123456",
          role: 'admin',
          password,
        };

        try {
          const res = await axios.post(endpoints.auth.login, credentials);
          newSession(res.data);
        } catch (error) {
          throw new Error(getErrorMessage(error));
        }
      })();
    },
    [newSession]
  );

  const forgot = useCallback(async (phone: string) => {
    sessionStorage.setItem('verify_phone', JSON.stringify(phone));
    const credentials = {
      phoneNumber: phone, // "20123456"   20123456  admin  Admin@12345,
      role: 'admin',
    };

    await axios.post(endpoints.auth.forgot, credentials);
  }, []);

  const verify = useCallback(
    async (code: string) => {
      const savedPhone = JSON.parse(sessionStorage.getItem('verify_phone') as string);
      const credentials = {
        phoneNumber: state.phone || savedPhone,
        code,
      };

      const res = await axios.post(endpoints.auth.verify, credentials);
      const { data } = res;
      sessionStorage.setItem('resetToken', JSON.stringify(data?.token));
      console.log(data);
    },
    [state.phone]
  );

  const changePassword = useCallback(async (password: string) => {
    const credentials = {
      newPassword: password,
    };
    const getResetToken = JSON.parse(sessionStorage.getItem('resetToken') as string);
    const headers = {
      headers: {
        Authorization: `Bearer ${getResetToken}`,
      },
    };
    await axios.post(endpoints.auth.newPassword, credentials, headers);
    sessionStorage.removeItem('resetToken');
  }, []);

  // REGISTER
  const register = useCallback(
    (email: string, password: string, firstName: string, lastName: string) => {
      (async () => {
        const data = {
          email,
          password,
          firstName,
          lastName,
        };

        const res = await axios.post(endpoints.auth.register, data);

        newSession(res.data);

        dispatch({
          type: Types.REGISTER,
          payload: {
            user: null,
          },
        });
      })();
    },
    [newSession]
  );

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      phone: state.phone,
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
    [state.user, state.phone, status, login, register, forgot, verify, changePassword, logout]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
