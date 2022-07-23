import React from 'react';
import { Container } from 'react-bootstrap';
import { BaseConnector, Bytes, ConfigureParam } from '@3auth/core';
import {
  AuthToken,
  SiginNonce,
  LoginLauncherProvider,
  useLoginState,
  ChangeUserInfoDto,
  AuthServerAdapter,
  useMyInfo,
} from '@3auth/signlogin';
import { AuthStateBox } from '@3auth/react-ui';
import { MetamaskConnector } from '@3auth/wallet_metamask';
import { PhantomConnector } from '@3auth/wallet_phantom';
import { ExButton, ExPopover, ExPopoverBox } from '@3lib/components';
import { StyleHelper } from '@3lib/helpers';
import { Web3AuthProvider } from '@3auth/react';
import { Class } from 'utility-types';
import { EthereumChainInfoHelper } from '@3auth/helpers';
import styles from './index.module.scss';
import { UserInfoDto } from '@3auth/signlogin/dist/domain/userInfo';

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
    isSignLogin: true,
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
      <LoginLauncherProvider authServer={new TestAuthServerAdapter()}>
        {props.children}
        {/* <SignLoginPluginProvider
          authServerAdapter={new TestSignLoginServerAdapter()}
        >
        </SignLoginPluginProvider> */}
      </LoginLauncherProvider>
    </Web3AuthProvider>
  );
}

class TestAuthServerAdapter extends AuthServerAdapter {
  public async walletSignLogin(
    account: string,
    hexsign: string,
    nonce: string,
  ): Promise<string> {
    return 'sadas';
  }

  public async getMyInfo(): Promise<UserInfoDto> {
    return {
      id: 1,
      regTm: 12323,
    };
  }
  public async setUserInfo(dto: ChangeUserInfoDto): Promise<boolean> {
    return true;
  }

  public async getSiginNonce(): Promise<SiginNonce> {
    return '123456';
  }

  public async auth(): Promise<AuthToken> {
    return '123456789';
  }
}

// class TestSignLoginServerAdapter extends SignLoginServerAdapter {
//   public async getSiginNonce(): Promise<SiginNonce> {
//     return 'abcdetf';
//   }

//   public async auth(): Promise<AuthToken> {
//     return '123456789';
//   }
// }

function PageConnent() {
  const loginState = useLoginState();

  const { myInfo } = useMyInfo();

  console.info('======loginState===========', loginState);
  console.info('======myInfo===========', myInfo);

  return (
    <Container>
      <AuthStateBox
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
                        {context.walletState.shortAccount}
                      </div>
                    </div>
                  );
                }}
                onPopoverBuilder={closeHandle => {
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
