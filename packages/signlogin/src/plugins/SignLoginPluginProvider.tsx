import React, { useContext, useMemo } from 'react';
import { createContext } from 'react';
import { SignLoginPlugin } from './SignLoginPlugin';
import { useWalletConnector, useWalletState } from '@3auth/react';
import { SignLoginServerAdapter } from './SignLoginServerAdapter';
import { useLoginLauncher } from '../react/context';

export const SignLoginPluginContext = createContext<SignLoginPlugin | null>(
  null,
);

interface SignLoginPluginProviderProps {
  authServerAdapter: SignLoginServerAdapter;
}

export function SignLoginPluginProvider(
  props: React.PropsWithChildren<SignLoginPluginProviderProps>,
) {
  const { authServerAdapter } = props;

  const walletConnector = useWalletConnector();

  const walletState = useWalletState();

  const loginLauncher = useLoginLauncher();

  const plugin = useMemo(() => {
    return new SignLoginPlugin(loginLauncher);
  }, [loginLauncher]);

  useMemo(() => {
    plugin.setContext({
      authServerAdapter,
      walletConnector,
      walletState,
    });
  }, [authServerAdapter, walletConnector, walletState]);

  return (
    <SignLoginPluginContext.Provider value={plugin}>
      {props.children}
    </SignLoginPluginContext.Provider>
  );
}

export function useSignLoginPlugin() {
  const context = useContext(SignLoginPluginContext);

  if (!context) throw new Error('no SignLoginPluginContext');

  return context;
}
