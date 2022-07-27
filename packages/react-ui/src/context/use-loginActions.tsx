import React from 'react';
import { ExDialogBox, useModalAction } from '@3lib/components';
import { Web3LoginBox } from '../components';
import { useMemoizedFn } from 'ahooks';

export function useLoginAction() {
  const { openDialog } = useModalAction();

  const openLoginDialog = useMemoizedFn(() => {
    openDialog(
      <ExDialogBox title={'Connect Wallet'}>
        <Web3LoginBox />
      </ExDialogBox>,
    );
  });

  return { openLoginDialog };
}
