import React from 'react';
import { ExDialogBox, ExModalProvider, useModalAction } from '@3lib/components';
import { useMemoizedFn } from 'ahooks';
import { Web3LoginBox } from './LoginBox';
import { useLoginLauncher, useLoginState } from '@3auth/react';
import { LoginLauncherSdk, UserInfo } from '@3auth/core';

interface LoggedContext {
  loginLauncher: LoginLauncherSdk;
  myInfo: UserInfo;
}

interface NotLoggedContext {
  loginLauncher: LoginLauncherSdk;
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

  const loginState = useLoginState();
  const loginLauncher = useLoginLauncher();

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
        ? onLoggedBuilder({ loginLauncher, myInfo: loginState.userInfo! })
        : onNotLoggedBuilder({ loginLauncher, openLoginDialog })}
    </>
  );
}
