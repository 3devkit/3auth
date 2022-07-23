import React, { useContext, useMemo } from 'react';
import { createContext } from 'react';
import { LoginLauncherSdk } from '../../application';
import { AuthServerAdapter } from '../../domain/authServerAdapter';
import { LoginStateProvider } from './LoginStateProvider';

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
    const ll = new LoginLauncherSdk(authServer);

    ll.eagerlyLogin();

    return ll;
  }, [authServer]);

  return (
    <LoginLauncherContext.Provider value={loginLauncher}>
      <LoginStateProvider>{props.children}</LoginStateProvider>
    </LoginLauncherContext.Provider>
  );
}

export function useLoginLauncher() {
  const context = useContext(LoginLauncherContext);

  if (!context) throw new Error('no LoginLauncherProviderContext');

  return context;
}
