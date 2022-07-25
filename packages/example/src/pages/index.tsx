import React, { useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { ConfigureParam } from '@3walletconnector/core';
import { MetamaskConnector } from '@3walletconnector/wallet-metamask';
import { PhantomConnector } from '@3walletconnector/wallet-phantom';
import { EthereumChainInfoHelper } from '@3walletconnector/helpers';
import { AuthProvider } from '@3auth/react';
import { ExButton, ExLoading, ExPopover, ExPopoverBox } from '@3lib/components';
import { StyleHelper } from '@3lib/helpers';
import { LoginStateWrapper } from '@3auth/react-ui';
import styles from './index.module.scss';

export default function Page() {
  return <PageConnent />;
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutConnent>{page}</LayoutConnent>;
};

function LayoutConnent(props: React.PropsWithChildren<unknown>) {
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
    const connectors = [PhantomConnector, MetamaskConnector];

    return { configure, connectors };
  }, []);

  return web3AuthProps;
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
                            context.auth.signout();
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
