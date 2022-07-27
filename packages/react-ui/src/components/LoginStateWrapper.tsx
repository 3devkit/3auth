import React, { useEffect } from 'react';
import { ExDialogBox, ExModalProvider, useModalAction } from '@3lib/components';
import { useMemoizedFn } from 'ahooks';
import { Web3LoginBox } from './LoginBox';
import { UserInfo } from '@3auth/core';
import {
  useAuth,
  useLoginState,
  useWalletState,
  WalletState,
} from '@3auth/react';
import { AuthSdk } from '@3auth/auth';

interface LoggedContext {
  auth: AuthSdk;
  myInfo: UserInfo;
}

interface NotLoggedContext {
  auth: AuthSdk;
  openLoginDialog: () => void;
}

interface LoginStateWrapperProps {
  onLoadingBuilder: () => JSX.Element;
  onLoggedBuilder: (context: LoggedContext) => JSX.Element;
  onNotLoggedBuilder: (context: NotLoggedContext) => JSX.Element;
}

export function LoginStateWrapper(props: LoginStateWrapperProps) {
  return (
    <ExModalProvider>
      <LoginStateContent {...props} />
    </ExModalProvider>
  );
}

function walletStateToUserInfo(walletState: WalletState): UserInfo {
  return UserInfo.fromDto({
    id: 0,
    regTm: 0,
    account: walletState.account,
  });
}

function LoginStateContent(props: LoginStateWrapperProps) {
  const { onLoggedBuilder, onNotLoggedBuilder, onLoadingBuilder } = props;

  const { openDialog } = useModalAction();

  const auth = useAuth();
  const loginState = useLoginState();
  const walletState = useWalletState();

  const openLoginDialog = useMemoizedFn(() => {
    openDialog(
      <ExDialogBox title={'Connect Wallet'}>
        <Web3LoginBox />
      </ExDialogBox>,
    );
  });

  useEffect(() => {
    // Handling non-signature logins
    if (!auth.config.isSignLogin) {
      if (walletState.isConnected) {
        auth.loginLauncher.actions.getMyInfoSuccess(
          walletStateToUserInfo(walletState),
        );
      }
    }
  }, [walletState]);

  if (loginState.isMyInfoGetting) return onLoadingBuilder();

  const myInfo = loginState.userInfo!;

  return (
    <>
      {loginState.hasUserInfo
        ? onLoggedBuilder({ auth, myInfo })
        : onNotLoggedBuilder({ auth, openLoginDialog })}
    </>
  );
}
