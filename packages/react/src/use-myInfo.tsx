import React, { useEffect } from 'react';
import useSWR from 'swr';
import { useStore } from 'zustand';
import { UserInfo } from '@3auth/core';
import { useLoginLauncher } from './provider';
import { useLoginState } from './use-loginState';

const GET_SWR_KEY = (account: string) => {
  return `getMyInfo/${account}`;
};

export function MyInfoProvider() {
  const loginLauncher = useLoginLauncher();

  const loginState = useLoginState();

  const { data: myInfo, mutate: reload } = useSWR(
    loginState.account && GET_SWR_KEY(loginState.account),

    async () => {
      const userInfoDto = await loginLauncher.authServerAdapter.getMyInfo();
      return UserInfo.fromDto(userInfoDto);
    },
  );

  useEffect(() => {
    if (myInfo) {
      loginLauncher.actions.getMyInfoSuccess(myInfo);
    }
  }, [myInfo]);

  return <></>;
}

export const useMyInfo = () => {
  const loginLauncher = useLoginLauncher();

  const myInfo = useStore(
    loginLauncher.store.originalStore,
    state => state.userInfo,
  );

  return { myInfo };
};
