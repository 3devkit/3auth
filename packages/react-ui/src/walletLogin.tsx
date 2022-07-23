import React, { useState } from 'react';
import { BaseConnector } from '@3auth/core';
import { useWalletConnector, useWalletState } from '@3auth/react';
import { useLoginState, useSignLoginPlugin } from '@3auth/signlogin';
import { BrowserRender } from '@3auth/helpers';
import { BsChevronLeft } from 'react-icons/bs';
import { ExButton, ExLoading, useModalAction } from '@3lib/components';
import { IconButton } from './components/button';
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
      onBuilderSignView={onBack => {
        return <SignBox onBack={onBack} />;
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
  onBuilderSignView: (onBack: () => void) => JSX.Element;
}) {
  const {
    className,
    walletListClassName,
    onBuilderListTile,
    onBuilderSignView,
  } = props;

  const { closeDialog } = useModalAction();

  const walletConnector = useWalletConnector();

  const [selected, setSelected] = useState<BaseConnector | null>(null);

  const [loadingConnector, setLoadingConnector] =
    useState<BaseConnector | null>(null);

  async function onConnect(connector: BaseConnector) {
    if (!connector.isInstalled) {
      window.open(connector.installUrl);
      return;
    }

    setLoadingConnector(connector);

    const walletState = await walletConnector.connect(connector.name);

    setLoadingConnector(null);

    if (walletState.isConnected) {
      if (walletConnector.configure.isSignLogin) {
        setSelected(connector);
      } else {
        closeDialog();
      }
    }
  }

  function onBack() {
    setSelected(null);
  }

  return (
    <div className={className}>
      {selected ? (
        onBuilderSignView(onBack)
      ) : (
        <div className={walletListClassName}>
          {walletConnector.connectors.map(connector => {
            return (
              <div key={connector.name}>
                {onBuilderListTile(
                  connector,
                  onConnect,
                  loadingConnector === connector,
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SignBox(props: { onBack: () => void }) {
  const { onBack } = props;

  const walletState = useWalletState();

  const signLoginPlugin = useSignLoginPlugin();

  const loginState = useLoginState();

  const { closeDialog } = useModalAction();

  async function onSign() {
    const loginState = await signLoginPlugin.signLogin();

    if (loginState.isLogin) {
      closeDialog();
    }
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
