import React, { useState } from 'react';
import { BaseConnector } from '@3auth/core';
import { useWalletConnector, useWalletState } from '@3auth/react';
import { BrowserRender } from '@3auth/helpers';
import { BsChevronLeft } from 'react-icons/bs';
import { ExButton, ExLoading } from '@3lib/components';
import { IconButton } from './components/button';
import styles from './styles.less';

export function WalletLogin() {
  return (
    <WalletList
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

function WalletList(props: {
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
      setSelected(connector);
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

  const walletConnector = useWalletConnector();

  const walletState = useWalletState();

  const [loggingin, setLoggingin] = useState<boolean>(false);

  function onSign() {
    // setLoggingin(true);
    walletConnector.signMessage('abc');
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
          loading={loggingin}
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
