import React, { useEffect } from 'react';
import useSWR from 'swr';
import { useStore } from 'zustand';
import { useLoginState } from './use-loginState';
import { useAuth } from './provider';

const GET_SWR_KEY = (account: string) => {
  return `getMyInfo/${account}`;
};

export function MyInfoProvider(props: React.PropsWithChildren<unknown>) {
  const auth = useAuth();

  const loginState = useLoginState();

  const {
    data: myInfo,
    mutate: reload,
    error,
  } = useSWR(
    loginState.account && GET_SWR_KEY(loginState.account),

    async () => {
      return await auth.reqMyInfo();
    },
  );

  useEffect(() => {
    if (error) {
      console.info('error:', error);
    } else if (myInfo) {
      auth.loginLauncher.actions.getMyInfoSuccess(myInfo);
    }
  }, [myInfo, error]);

  return <>{props.children}</>;
}

export const useMyInfo = () => {
  const auth = useAuth();

  const myInfo = useStore(auth.store, state => state.userInfo);

  return { myInfo };
};
