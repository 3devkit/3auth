import React from 'react';
import { Container } from 'react-bootstrap';
import { ConfigureParam } from '@3walletconnector/core';
import { Web3AuthProvider } from '@3walletconnector/react';
import { MetamaskConnector } from '@3walletconnector/wallet-metamask';
import { PhantomConnector } from '@3walletconnector/wallet-phantom';
import { EthereumChainInfoHelper } from '@3walletconnector/helpers';
import { LoginLauncherProvider } from '@3auth/react';
import { ExButton, ExLoading, ExPopover, ExPopoverBox } from '@3lib/components';
import { StyleHelper } from '@3lib/helpers';
import { TestAuthServerAdapter } from '@/3org/server';
import { LoginStateWrapper } from '@/view/LoginStateWrapper';
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
    supportedEthereumChain: [
      EthereumChainInfoHelper.getMainnet(),
      EthereumChainInfoHelper.getRinkeby(),
    ],
  };

  return (
    <Web3AuthProvider
      configure={configure}
      connectors={[PhantomConnector, MetamaskConnector]}
    >
      <LoginLauncherProvider authServer={new TestAuthServerAdapter()}>
        {props.children}
      </LoginLauncherProvider>
    </Web3AuthProvider>
  );
}

function PageConnent() {
  return (
    <Container>
      <LoginStateWrapper
        onLoadingBuilder={() => {
          return <ExLoading />;
        }}
        onLoggedBuilder={context => {
          return (
            <div className={styles.UserBox}>
              <ExPopover
                onButtonBuilder={open => {
                  return (
                    <div
                      className={StyleHelper.combinedSty(
                        styles.UserInfo,
                        open && styles.selected,
                      )}
                    >
                      <div className={styles.avatar} />
                      <div className={styles.name}>
                        {context.myInfo.shortAccount}
                      </div>
                    </div>
                  );
                }}
                onPopoverBuilder={closeHandle => {
                  return (
                    <ExPopoverBox>
                      <ul className={styles.MenuList}>
                        <li
                          onClick={() => {
                            closeHandle();
                            context.loginLauncher.actions.signout();
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
