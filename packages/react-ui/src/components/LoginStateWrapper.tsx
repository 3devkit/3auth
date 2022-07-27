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
import { useLoginAction } from '../context/use-loginActions';

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

function LoginStateContent(props: LoginStateWrapperProps) {
  const { onLoggedBuilder, onNotLoggedBuilder, onLoadingBuilder } = props;

  const { openLoginDialog } = useLoginAction();

  const auth = useAuth();

  const loginState = useLoginState();

  if (loginState.isMyInfoGetting) return onLoadingBuilder();

  return (
    <>
      {loginState.hasUserInfo
        ? onLoggedBuilder({ auth, myInfo: loginState.userInfo! })
        : onNotLoggedBuilder({ auth, openLoginDialog })}
    </>
  );
}
