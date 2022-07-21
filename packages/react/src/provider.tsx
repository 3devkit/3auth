import React, { useEffect, useMemo } from 'react';
import {
  BaseConnector,
  Configure,
  ConfigureParam,
  WalletConnectorSdk,
} from '@3auth/core';
import { WalletConnectorProvider, WalletStateProvider } from './context';
import { Class } from 'utility-types';

export interface Web3AuthProviderProps {
  configure: ConfigureParam;
  connectors: Class<BaseConnector>[];
}

export function Web3AuthProvider(
  props: React.PropsWithChildren<Web3AuthProviderProps>,
) {
  const { configure, connectors } = props;

  const walletConnector = useMemo(() => {
    const walletConnector = new WalletConnectorSdk(
      Configure.fromParam(configure),
    );

    connectors.forEach(Connector => {
      walletConnector.addConnector(
        (actions, configure) => new Connector(actions, configure),
      );
    });

    return walletConnector;
  }, []);

  return (
    <WalletConnectorProvider walletConnector={walletConnector}>
      <WalletStateProvider>{props.children}</WalletStateProvider>
    </WalletConnectorProvider>
  );
}
