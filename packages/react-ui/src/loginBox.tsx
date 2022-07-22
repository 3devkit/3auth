import React from 'react';
import { LoginProvider } from './loginController';
import { WalletLogin } from './walletLogin';
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
      <WalletLogin />
    </>
  );
}
