import React, { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { LoginState } from '../../domain/loginState';
import { useLoginLauncher } from './LoginLauncherProvider';

export const LoginStateContext = createContext<LoginState | null>(null);

export function LoginStateProvider(props: React.PropsWithChildren<unknown>) {
  const loginLauncher = useLoginLauncher();

  const [loginState, setLoginState] = useState<LoginState>(new LoginState());

  useEffect(() => {
    const unsubscribe = loginLauncher.subscribeChange(state => {
      setLoginState(LoginState.fromDto(state));
    });

    return () => {
      unsubscribe();
    };
  }, [loginLauncher]);

  return (
    <LoginStateContext.Provider value={loginState}>
      {props.children}
    </LoginStateContext.Provider>
  );
}

export function useLoginState() {
  const context = useContext(LoginStateContext);

  if (!context) throw new Error('no LoginStateContext');

  return context;
}
