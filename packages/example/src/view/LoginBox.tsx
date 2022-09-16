import { LoginStateWrapper } from '@3auth/react';
import { ExButton, ExLoading, ExPopover, ExPopoverBox } from '@3lib/components';
import { StyleHelper } from '@3lib/helpers';
import styles from './LoginBox.module.scss';

export function LoginBox() {
  return (
    <LoginStateWrapper
      onLoadingBuilder={() => {
        return <ExLoading />;
      }}
      onLoggedBuilder={context => {
        return (
          <div className={styles.UserBox}>
            <ExPopover
              onButtonBuilder={open => {
                return (
                  <div
                    className={StyleHelper.combinedSty(
                      styles.UserInfo,
                      open && styles.selected,
                    )}
                  >
                    <div className={styles.avatar} />
                    <div className={styles.name}>
                      {context.myInfo.shortAccount}
                    </div>
                  </div>
                );
              }}
              onPopoverBuilder={closeHandle => {
                return (
                  <ExPopoverBox>
                    <ul className={styles.MenuList}>
                      <li
                        onClick={() => {
                          closeHandle();
                          context.auth.signout();
                        }}
                      >
                        <div className={styles.left}>Disconnect Wallet</div>
                      </li>
                    </ul>
                  </ExPopoverBox>
                );
              }}
            />
          </div>
        );
      }}
      onNotLoggedBuilder={context => {
        return <ExButton onClick={context.openLoginDialog}>Login</ExButton>;
      }}
    />
  );
}
