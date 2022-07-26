import React, { useState } from 'react';
import { useWalletState, BaseConnector } from '@3walletconnector/react';
import { BrowserRender } from '@3lib/helpers';
import { BsChevronLeft } from 'react-icons/bs';
import { ExButton, ExLoading, useModalAction } from '@3lib/components';
import { IconButton } from './button';
import { useLoginBoxController } from './controller';
import { useAuth, useLoginState } from '@3auth/react';
import styles from './styles.less';

export function WalletList() {
  return (
    <WalletListWrapper
      walletListClassName={styles.WalletList}
      onBuilderListTile={(connector, onConnect, loading) => {
        return (
          <WalletTile
            connector={connector}
            onClick={onConnect}
            loading={loading}
          />
        );
      }}
    />
  );
}

export function WalletListWrapper(props: {
  className?: string;
  walletListClassName?: string;
  onBuilderListTile: (
    connector: BaseConnector,
    onConnect: (connector: BaseConnector) => void,
    loading: boolean,
  ) => JSX.Element;
}) {
  const { className, walletListClassName, onBuilderListTile } = props;

  const boxController = useLoginBoxController();

  const auth = useAuth();

  const { closeDialog } = useModalAction();

  const [selected, setSelected] = useState<BaseConnector | null>(null);

  async function onConnect(connector: BaseConnector) {
    if (!connector.isInstalled) {
      window.open(connector.installUrl);
      return;
    }

    setSelected(connector);

    const walletState = await auth.walletConnector.connect(connector.name);

    setSelected(null);

    if (walletState.isConnected) {
      if (auth.config.isSignLogin) {
        boxController.show('signLogin');
      } else {
        closeDialog();
      }
    }
  }

  return (
    <div className={className}>
      <div className={walletListClassName}>
        {auth.walletConnector.connectors.map(connector => {
          return (
            <div key={connector.name}>
              {onBuilderListTile(connector, onConnect, selected === connector)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SignBox() {
  const auth = useAuth();

  const walletState = useWalletState();

  const loginState = useLoginState();

  const { closeDialog } = useModalAction();

  const loginBoxController = useLoginBoxController();

  async function onSign() {
    const loginState = await auth.plugins.walletLoginPlugin.signLogin(
      auth.walletConnector,
    );

    if (loginState.isLogged) {
      closeDialog();
    }
  }

  function onBack() {
    loginBoxController.show('home');
  }

  return (
    <div className={styles.SignBox}>
      <div className={styles.header}>
        <IconButton onClick={onBack}>
          <BsChevronLeft />
        </IconButton>
      </div>
      <div className={styles.account}>{walletState.shortAccount}</div>
      <div className={styles.but}>
        <ExButton
          onClick={onSign}
          loading={loginState.isLoggingin}
          style={{ width: '100%' }}
        >
          Sign Login
        </ExButton>
      </div>
    </div>
  );
}

function WalletTile(props: {
  connector: BaseConnector;
  onClick: (connector: BaseConnector) => void;
  loading?: boolean;
}) {
  const { connector, loading = false, onClick } = props;

  return (
    <div
      key={connector.name}
      className={styles.item}
      onClick={() => onClick(connector)}
    >
      <div className={styles.left}>
        {connector.icon}
        {connector.name}
      </div>
      <div className={styles.right}>
        <BrowserRender
          onRender={() => (
            <>
              {!connector.isInstalled && (
                <div className={styles.tag}>Install</div>
              )}

              {loading && (
                <div className={styles.loading}>
                  <ExLoading />
                </div>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
}
