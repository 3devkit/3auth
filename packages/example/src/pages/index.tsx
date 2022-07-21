import React from 'react';
import { Button, Container, Stack } from 'react-bootstrap';
import { BaseConnector, ConfigureParam } from '@3auth/core';
import { MetamaskConnector } from '@3auth/wallet_metamask';
import { PhantomConnector } from '@3auth/wallet_phantom';
import {
  useWalletConnector,
  useWalletState,
  Web3AuthProvider,
} from '@3auth/react';
import { Class } from 'utility-types';
import { BrowserRender, EthereumChainInfoHelper } from '@3auth/helpers';
import styles from './index.module.scss';

export default function Page() {
  return <PageConnent />;
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutConnent>{page}</LayoutConnent>;
};

function LayoutConnent(props: React.PropsWithChildren<unknown>) {
  const configure: ConfigureParam = {
    appName: '',
    defaultConnectChainId: EthereumChainInfoHelper.getMainnet().chainId,
    isSignLogin: false,
    signNoceMessage: 'hello',
    supportedEthereumChain: [
      EthereumChainInfoHelper.getMainnet(),
      EthereumChainInfoHelper.getRinkeby(),
      {
        chainId: 56,
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        chainName: 'Smart Chain',
        nativeCurrency: {
          name: 'Smart Chain',
          symbol: 'BNB',
          decimals: 18,
        },
        blockExplorerUrls: ['https://bscscan.com'],
      },
    ],
  };

  const connectors: Class<BaseConnector>[] = [
    PhantomConnector,
    MetamaskConnector,
  ];

  return (
    <Web3AuthProvider configure={configure} connectors={connectors}>
      {props.children}
    </Web3AuthProvider>
  );
}

function PageConnent() {
  const walletConnector = useWalletConnector();

  const walletState = useWalletState();

  async function onDisconnect() {
    await walletConnector.disconnect();
  }

  async function onSignMessage() {
    const signedMessage = await walletConnector.signMessage(
      'Hi! my name is walle',
    );
  }

  return (
    <Container>
      {walletState.isConnected ? (
        <Stack direction="horizontal" gap={3}>
          <div>account : {walletState.account}</div>
          <div>chainId : {walletState.chainId}</div>
          <Button onClick={onDisconnect} variant="link">
            Disconnect
          </Button>
          <Button onClick={onSignMessage}>Sign Message</Button>
        </Stack>
      ) : (
        <>
          <WalletList />
          {walletState.isConnecting && `Connecting...`}
        </>
      )}
    </Container>
  );
}

function WalletList() {
  const walletConnector = useWalletConnector();

  async function onConnect(connector: BaseConnector) {
    if (!connector.isInstalled) {
      window.open(connector.installUrl);
      return;
    }

    await walletConnector.connect(connector.name);
  }

  return (
    <div className={styles.WalletList}>
      {walletConnector.connectors.map(connector => {
        return (
          <div
            key={connector.name}
            className={styles.item}
            onClick={() => onConnect(connector)}
          >
            <div className={styles.left}>
              {connector.icon}
              {connector.name}
            </div>
            <div className={styles.right}>
              <BrowserRender
                onRender={() => (
                  <>
                    {!connector.isInstalled && (
                      <div className={styles.tag}>Install</div>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
