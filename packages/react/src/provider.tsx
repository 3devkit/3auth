import React, { useContext, useEffect, useMemo } from 'react';
import { createContext } from 'react';
import { LoginLauncherSdk, AuthServerAdapter } from '@3auth/core';
import { MyInfoProvider } from './use-myInfo';

export const LoginLauncherContext = createContext<LoginLauncherSdk | null>(
  null,
);

interface LoginLauncherProviderProps {
  authServer: AuthServerAdapter;
}

export function LoginLauncherProvider(
  props: React.PropsWithChildren<LoginLauncherProviderProps>,
) {
  const { authServer } = props;

  const loginLauncher = useMemo(() => {
    return new LoginLauncherSdk(authServer);
  }, [authServer]);

  useEffect(() => {
    loginLauncher.actions.eagerlyLogin();
  }, [loginLauncher]);

  return (
    <LoginLauncherContext.Provider value={loginLauncher}>
      <MyInfoProvider />
      {props.children}
    </LoginLauncherContext.Provider>
  );
}

export function useLoginLauncher() {
  const context = useContext(LoginLauncherContext);

  if (!context) throw new Error('no LoginLauncherProviderContext');

  return context;
}
