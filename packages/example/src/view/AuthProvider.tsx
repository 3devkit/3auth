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
  appName: 'app1' | 'app2';
  isPhantom?: boolean;
  isMetamask?: boolean;
}

export function Web3AuthProvider(
  props: React.PropsWithChildren<Web3AuthProviderProps>,
) {
  const { appName } = props;

  const web3AuthProps = useWeb3AuthProps(props);

  return (
    <AuthProvider
      config={{
        appName,
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
  const { appName, isMetamask, isPhantom } = props;

  const web3AuthProps = useMemo(() => {
    const configure: ConfigureParam = {
      appName,
      defaultConnectChainId: EthereumChainInfoHelper.getRinkeby().chainId,
      supportedEthereumChain: [
        EthereumChainInfoHelper.getMainnet(),
        EthereumChainInfoHelper.getRinkeby(),
      ],
    };

    const connectors: Class<BaseConnector>[] = [];

    if (isPhantom) connectors.push(PhantomConnector);
    if (isMetamask) connectors.push(MetamaskConnector);

    return { configure, connectors };
  }, []);

  return web3AuthProps;
}
