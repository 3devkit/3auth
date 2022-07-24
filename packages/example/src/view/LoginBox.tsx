import React from 'react';
import { LoginProvider, useView } from './LoginController';
import styles from './styles.module.scss';

export function Web3LoginBox(props: React.PropsWithChildren<unknown>) {
  return (
    <div className={styles.LoginBox}>
      <LoginProvider>
        <LoginBoxContent />
      </LoginProvider>
    </div>
  );
}

function LoginBoxContent() {
  const view = useView();
  return <>{view}</>;
}
