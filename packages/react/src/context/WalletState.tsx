import React, { useContext, useState } from 'react';
import { createContext, useEffect } from 'react';
import { WalletState } from '@3auth/core';
import { useWalletConnector } from './WalletConnector';

export const WalletStateConrtext = createContext<WalletState | null>(null);

export function WalletStateProvider(props: React.PropsWithChildren<unknown>) {
  const walletConnector = useWalletConnector();

  const [walletState, setWalletState] = useState<WalletState>(
    new WalletState(),
  );

  useEffect(() => {
    const unsubscribe = walletConnector.subscribeChange(state => {
      setWalletState(WalletState.fromDto(state));
    });

    walletConnector.eagerlyConnect();

    return () => {
      unsubscribe();
    };
  }, [walletConnector]);

  return (
    <WalletStateConrtext.Provider value={walletState}>
      {props.children}
    </WalletStateConrtext.Provider>
  );
}

export function useWalletState() {
  const context = useContext(WalletStateConrtext);

  if (!context) throw new Error('no WalletStateConrtext');

  return context;
}
