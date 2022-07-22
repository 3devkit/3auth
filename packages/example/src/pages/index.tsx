import React from 'react';
import { Container } from 'react-bootstrap';
import { BaseConnector, ConfigureParam } from '@3auth/core';
import { AuthStateBox } from '@3auth/react-ui';
import { MetamaskConnector } from '@3auth/wallet_metamask';
import { PhantomConnector } from '@3auth/wallet_phantom';
import { ExButton, ExPopover, ExPopoverBox } from '@3lib/components';
import { StyleHelper } from '@3lib/helpers';
import {
  useWalletConnector,
  useWalletState,
  Web3AuthProvider,
} from '@3auth/react';
import { Class } from 'utility-types';
import { EthereumChainInfoHelper } from '@3auth/helpers';
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
  return (
    <Container>
      <AuthStateBox
        onLoggedBuilder={context => {
          return (
            <div className={styles.UserBox}>
              <ExPopover
                onButtonBuilder={function (open) {
                  return (
                    <div
                      className={StyleHelper.combinedSty(
                        styles.UserInfo,
                        open ? styles.selected : '',
                      )}
                    >
                      <div className={styles.avatar} />
                      <div className={styles.name}>
                        {context.walletState.shortAccount}
                      </div>
                    </div>
                  );
                }}
                onPopoverBuilder={function (closeHandle) {
                  return (
                    <ExPopoverBox>
                      <ul className={styles.MenuList} style={{ width: 200 }}>
                        <li
                          onClick={() => {
                            closeHandle();
                            context.walletConnector.disconnect();
                          }}
                        >
                          <div className={styles.left}>Disconnect Wallet</div>
                        </li>
                      </ul>
                    </ExPopoverBox>
                  );
                }}
              />
            </div>
          );
        }}
        onNotLoggedBuilder={context => {
          return (
            <ExButton onClick={context.openLoginDialog}>
              Connect Wallet
            </ExButton>
          );
        }}
      />
    </Container>
  );
}
