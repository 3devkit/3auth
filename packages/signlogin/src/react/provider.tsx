import React, { useContext, useMemo } from 'react';
import { createContext } from 'react';
import { LoginLauncherSdk } from '../application';
import { AuthServerAdapter } from '../domain/authServerAdapter';
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
