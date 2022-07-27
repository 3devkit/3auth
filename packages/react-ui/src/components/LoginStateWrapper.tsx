import React from 'react';
import { ExDialogBox, ExModalProvider, useModalAction } from '@3lib/components';
import { useMemoizedFn } from 'ahooks';
import { Web3LoginBox } from './LoginBox';
import { UserInfo } from '@3auth/core';
import { useAuth, useLoginState } from '@3auth/react';
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

function LoginStateContent(props: LoginStateWrapperProps) {
  const { onLoggedBuilder, onNotLoggedBuilder, onLoadingBuilder } = props;

  const { openDialog } = useModalAction();

  const auth = useAuth();
  const loginState = useLoginState();

  const openLoginDialog = useMemoizedFn(() => {
    openDialog(
      <ExDialogBox title={'Connect Wallet'}>
        <Web3LoginBox />
      </ExDialogBox>,
    );
  });

  if (loginState.isMyInfoGetting) return onLoadingBuilder();

  return (
    <>
      {loginState.hasUserInfo
        ? onLoggedBuilder({ auth, myInfo: loginState.userInfo! })
        : onNotLoggedBuilder({ auth, openLoginDialog })}
    </>
  );
}
