import React, { useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useStore } from 'zustand';
import { useLoginState } from './use-loginState';
import { useAuth } from './provider';
import { UserInfo, useWalletState, WalletState } from '@3auth/react';

export function MyInfoProvider(props: React.PropsWithChildren<unknown>) {
  const auth = useAuth();

  if (auth.config.isSignLogin) {
    return <MyInfoProviderByServer>{props.children}</MyInfoProviderByServer>;
  } else {
    return <MyInfoProviderByWallet>{props.children}</MyInfoProviderByWallet>;
  }
}

export const useMyInfo = () => {
  const auth = useAuth();

  const { mutate } = useSWRConfig();

  const myInfo = useStore(auth.store, state => state.userInfo);

  function reload() {
    mutate(GET_SWR_KEY(auth.myInfo?.account));
  }

  return { myInfo, reload };
};

function MyInfoProviderByWallet(props: React.PropsWithChildren<unknown>) {
  const auth = useAuth();

  const walletState = useWalletState();

  useEffect(() => {
    if (walletState.isEagerlyConnecting) {
      auth.loginLauncher.actions.beginLogin();
    } else if (walletState.isConnected) {
      auth.loginLauncher.actions.loginSuccess(walletState.account!, '');
      auth.loginLauncher.actions.getMyInfoSuccess(
        walletStateToUserInfo(walletState),
      );
    } else if (
      !walletState.isEagerlyConnecting &&
      !walletState.isConnecting &&
      !walletState.account
    ) {
      auth.loginLauncher.actions.loginFail();
    }
  }, [auth, walletState]);

  return <>{props.children}</>;
}

function MyInfoProviderByServer(props: React.PropsWithChildren<unknown>) {
  const auth = useAuth();

  const loginState = useLoginState();

  const key = GET_SWR_KEY(auth.myInfo?.account);

  const { data: myInfo, error } = useSWR(
    loginState.isLogged && key,
    async () => {
      return await auth.reqMyInfo();
    },
  );

  useEffect(() => {
    auth.initLogin();
  }, [auth]);

  useEffect(() => {
    if (error) {
      console.info('error:', error);
    } else if (myInfo) {
      auth.loginLauncher.actions.getMyInfoSuccess(myInfo);
    }
  }, [auth, myInfo, error]);

  return <>{props.children}</>;
}

function GET_SWR_KEY(account?: string) {
  return `getMyInfo/${account}`;
}

function walletStateToUserInfo(walletState: WalletState): UserInfo {
  return UserInfo.fromDto({
    id: 0,
    regTm: 0,
    account: walletState.account,
  });
}
