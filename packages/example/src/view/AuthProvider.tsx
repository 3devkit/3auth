import React, { useMemo } from 'react';
import {
  PhantomConnector,
  MetamaskConnector,
  BaseConnector,
  ConfigureParam,
  EthereumChainInfoHelper,
  AuthProvider,
  LoginStateWrapper,
} from '@3auth/react';
import { Class } from 'utility-types';

export function Web3AuthProvider(props: React.PropsWithChildren<unknown>) {
  const web3AuthProps = useWeb3AuthProps();

  return (
    <AuthProvider
      serverUrl="https://test-server.hipass.xyz"
      web3AuthProps={web3AuthProps}
    >
      {props.children}
    </AuthProvider>
  );
}

function useWeb3AuthProps() {
  const web3AuthProps = useMemo(() => {
    const configure: ConfigureParam = {
      appName: '',
      defaultConnectChainId: EthereumChainInfoHelper.getMainnet().chainId,
      supportedEthereumChain: [
        EthereumChainInfoHelper.getMainnet(),
        EthereumChainInfoHelper.getRinkeby(),
      ],
    };
    const connectors: Class<BaseConnector>[] = [
      PhantomConnector,
      MetamaskConnector,
    ];

    return { configure, connectors };
  }, []);

  return web3AuthProps;
}