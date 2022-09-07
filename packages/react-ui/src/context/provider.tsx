import React, { useContext, useMemo } from 'react';
import { createContext } from 'react';
import { AuthSdk, AuthSdkConfigProps } from '@3auth/auth';
import { MyInfoProvider } from './use-myInfo';
import {
  useWalletConnector,
  Web3AuthProvider,
  Web3AuthProviderProps,
} from '@3walletconnector/react';

export const AuthContext = createContext<AuthSdk | null>(null);

export interface AuthProviderProps {
  config: AuthSdkConfigProps;
  web3AuthProps: Web3AuthProviderProps;
}

export function AuthProvider(
  props: React.PropsWithChildren<AuthProviderProps>,
) {
  const { web3AuthProps } = props;

  return (
    <Web3AuthProvider {...web3AuthProps}>
      <AuthProviderConnent {...props}>{props.children}</AuthProviderConnent>
    </Web3AuthProvider>
  );
}

function AuthProviderConnent(
  props: React.PropsWithChildren<AuthProviderProps>,
) {
  const { config, web3AuthProps } = props;

  const walletConnector = useWalletConnector();

  const auth = useMemo(() => {
    return new AuthSdk(config, walletConnector);
  }, [config, web3AuthProps, walletConnector]);

  return (
    <AuthContext.Provider value={auth}>
      <MyInfoProvider>{props.children}</MyInfoProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error('no AuthContext');

  return context;
}
