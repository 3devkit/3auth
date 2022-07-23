import React, { useEffect } from 'react';
import useSWR from 'swr';
import { useStore } from 'zustand';
import { UserInfo } from '../domain';
import { useLoginLauncher } from './provider';
import { useLoginState } from './use-loginState';

// export const useMyInfo = () => {
//   const loginLauncher = useLoginLauncher();

//   const loginState = useLoginState();

//   const { data: myInfo, mutate: reload } = useSWR(
//     loginState.account && GET_SWR_KEY(loginState.account),

//     async () => {
//       const userInfoDto = await loginLauncher.authServer.getMyInfo();
//       return UserInfo.fromDto(userInfoDto);
//     },
//   );

//   return { reload, myInfo };
// };

export const useMyInfo = () => {
  const loginLauncher = useLoginLauncher();

  const myInfo = useStore(loginLauncher.store.store, state => state.userInfo);

  return { myInfo };
};

const GET_SWR_KEY = (account: string) => {
  return `getMyInfo/${account}`;
};

export function MyInfoProvider() {
  const loginLauncher = useLoginLauncher();

  const loginState = useLoginState();

  const { data: myInfo, mutate: reload } = useSWR(
    loginState.account && GET_SWR_KEY(loginState.account),

    async () => {
      const userInfoDto = await loginLauncher.authServer.getMyInfo();
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
