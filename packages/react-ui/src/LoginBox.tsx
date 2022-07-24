import React from 'react';
import { LoginProvider } from './LoginController';
import { WalletList } from './WalletLogin';
import styles from './styles.less';

export function LoginBox(props: React.PropsWithChildren<unknown>) {
  return (
    <div className={styles.LoginBox}>
      <LoginProvider>
        <LoginBoxContent />
      </LoginProvider>
    </div>
  );
}

function LoginBoxContent() {
  return (
    <>
      <WalletList />
    </>
  );
}
