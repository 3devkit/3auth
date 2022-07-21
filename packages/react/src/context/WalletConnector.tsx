import React, { useContext } from 'react';
import { createContext } from 'react';
import { WalletConnectorSdk } from '@3auth/core';

export const WalletConnectorConrtext = createContext<WalletConnectorSdk | null>(null);

export function WalletConnectorProvider(props: React.PropsWithChildren<{ walletConnector: WalletConnectorSdk }>) {
  const { walletConnector } = props;

  return <WalletConnectorConrtext.Provider value={walletConnector}>{props.children}</WalletConnectorConrtext.Provider>;
}

export function useWalletConnector() {
  const context = useContext(WalletConnectorConrtext);

  if (!context) throw new Error('no Web3AuthConrtext');

  return context;
}
