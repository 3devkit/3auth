import React, { useMemo } from 'react';
import {
  PhantomConnector,
  MetamaskConnector,
  BaseConnector,
  ConfigureParam,
  EthereumChainInfoHelper,
  AuthProvider,
} from '@3auth/react';
import { Class } from 'utility-types';

interface Web3AuthProviderProps {
  namespace?: string;
}

export function Web3AuthProvider(
  props: React.PropsWithChildren<Web3AuthProviderProps>,
) {
  const { namespace } = props;

  const web3AuthProps = useWeb3AuthProps(props);

  return (
    <AuthProvider
      config={{
        namespace,
        serverUrl: 'https://test-server.hipass.xyz',
        isSignLogin: true,
      }}
      web3AuthProps={web3AuthProps}
    >
      {props.children}
    </AuthProvider>
  );
}

function useWeb3AuthProps(props: Web3AuthProviderProps) {
  const { namespace } = props;

  const web3AuthProps = useMemo(() => {
    const configure: ConfigureParam = {
      namespace,
      defaultConnectChainId: EthereumChainInfoHelper.getRinkeby().chainId,
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
