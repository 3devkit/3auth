import React, { useMemo } from 'react';
import {
  PhantomConnector,
  MetamaskConnector,
  BaseConnector,
  ConfigureParam,
  EthereumChainInfoHelper,
  AuthProvider,
  AuthSdkConfigProps,
} from '@3auth/react';
import { Class } from 'utility-types';
import { useCreation } from 'ahooks';

interface Web3AuthProviderProps {
  namespace?: string;
}

export function Web3AuthProvider(
  props: React.PropsWithChildren<Web3AuthProviderProps>,
) {
  const { namespace } = props;

  const web3AuthProps = useWeb3AuthProps(props);

  const config: AuthSdkConfigProps = useCreation(() => {
    return {
      namespace,
      serverUrl: 'https://test-server.hipass.xyz',
      isSignLogin: true,
    };
  }, []);

  return (
    <AuthProvider config={config} web3AuthProps={web3AuthProps}>
      {props.children}
    </AuthProvider>
  );
}

function useWeb3AuthProps(props: Web3AuthProviderProps) {
  const { namespace } = props;

  const web3AuthProps = useCreation(() => {
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
