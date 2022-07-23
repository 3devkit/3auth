import React, { createContext, useContext, useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { UserInfo } from '../../domain/userInfo';
import { useLoginLauncher } from './LoginLauncherProvider';
import { useLoginState } from './LoginStateProvider';

const MyInfoContext = createContext<UserInfo | undefined>(undefined);

const GET_SWR_KEY = (account: string) => {
  return `getMyInfo/${account}`;
};

export const MyInfoProvider: React.FC<React.PropsWithChildren> = props => {
  const loginLauncher = useLoginLauncher();

  const loginState = useLoginState();

  const { data: myInfo } = useSWR(
    loginState.account && GET_SWR_KEY(loginState.account),
    async () => {
      const userInfoDto = await loginLauncher.authServer.getMyInfo();
      return UserInfo.fromDto(userInfoDto);
    },
  );

  return (
    <MyInfoContext.Provider value={myInfo}>
      {props.children}
    </MyInfoContext.Provider>
  );
};

export const useMyInfo = () => {
  const { mutate } = useSWRConfig();

  const myInfo = useContext(MyInfoContext);

  const loginState = useLoginState();

  const reload = () => {
    if (loginState.account) {
      mutate(GET_SWR_KEY(loginState.account));
    }
  };

  return {
    myInfo,
    reload,
  };
};
