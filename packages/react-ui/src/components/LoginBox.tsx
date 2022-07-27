import React from 'react';
import { LoginProvider, useView } from './controller';
import styles from './styles.less';

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
