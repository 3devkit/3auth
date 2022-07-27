import React, { useContext, useEffect, useMemo } from 'react';
import { createContext } from 'react';
import { AuthSdk, AuthSdkConfigProps } from '@3auth/auth';
import { MyInfoProvider } from './use-myInfo';
import {
  useWalletConnector,
  Web3AuthProvider,
  Web3AuthProviderProps,
} from '@3walletconnector/react';
import { ExModalProvider } from '@3lib/components';

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
      <AuthProviderConnent {...props}>
        <ExModalProvider>{props.children}</ExModalProvider>
      </AuthProviderConnent>
    </Web3AuthProvider>
  );
}

function AuthProviderConnent(
  props: React.PropsWithChildren<AuthProviderProps>,
) {
  const { config } = props;

  const walletConnector = useWalletConnector();

  const auth = useMemo(() => {
    return new AuthSdk(config, walletConnector);
  }, [config, walletConnector]);

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
