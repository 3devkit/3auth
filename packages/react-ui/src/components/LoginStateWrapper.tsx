import React from 'react';
import { ExModalProvider } from '@3lib/components';
import { UserInfo } from '@3auth/core';
import { useAuth, useLoginState } from '@3auth/react';
import { AuthSdk } from '@3auth/auth';
import { useLoginAction } from '../context/use-loginActions';

export interface LoggedContext {
  auth: AuthSdk;
  myInfo: UserInfo;
}

export interface NotLoggedContext {
  auth: AuthSdk;
  openLoginDialog: () => void;
}

export interface LoginStateWrapperProps {
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
