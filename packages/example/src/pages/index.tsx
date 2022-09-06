import React, { useState } from 'react';
import { Container, Stack } from 'react-bootstrap';
import { LoginBox } from '@/view/LoginBox';
import {
  ExButton,
  ExPopover,
  ExPopoverBox,
  ExPopoverMenu,
} from '@3lib/components';
import { useAuth, useLoginState, useMyInfo } from '@3auth/react-ui';
import { Web3AuthProvider } from '@/view/AuthProvider';
import { OAuthProvider } from '@3auth/auth';

export default function Page() {
  return <PageConnent />;
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutConnent>{page}</LayoutConnent>;
};

function LayoutConnent(props: React.PropsWithChildren<unknown>) {
  return <>{props.children}</>;
}

function PageConnent() {
  return (
    <Container>
      <h3 className="mb-3">Login1</h3>
      <Login />

      <hr />

      <div className="mt-3">
        <h3 className="mb-3">Login2</h3>
        <Web3AuthProvider namespaces="app2">
          <Login />
        </Web3AuthProvider>
      </div>
    </Container>
  );
}

function Login() {
  const { isLogged } = useLoginState();

  return (
    <>
      <LoginBox />
      {isLogged && <Options />}
    </>
  );
}

function Options() {
  const auth = useAuth();

  const { myInfo, reload } = useMyInfo();

  const [bindTwitterLoading, setBindTwitterLLoading] = useState<boolean>(false);

  const [bindDiscordLoading, setBindDiscordLoading] = useState<boolean>(false);

  const [removeBindLoading, setRemoveBindLoading] = useState<boolean>(false);

  const [refreshLoading, setRefreshLoading] = useState<boolean>(false);

  const [cookie, setCookie] = useState<string>();

  async function onBindTiwitter() {
    setBindTwitterLLoading(true);

    await auth.twitterLogin();
  }

  async function onBindDiscord() {
    setBindDiscordLoading(true);

    await auth.discordLogin();
  }

  function onGetCookie() {
    const cookie = auth.getCookies();

    setCookie(JSON.stringify(cookie));
  }

  async function onRefreshToken() {
    setRefreshLoading(true);

    await auth.refreshToken();

    onGetCookie();

    setRefreshLoading(false);
  }

  async function onRemoveBind(authProvider: OAuthProvider) {
    setRemoveBindLoading(true);

    await auth.removeBind(authProvider);

    reload();

    setRemoveBindLoading(false);
  }

  return (
    <>
      <div className="mt-3">{JSON.stringify(myInfo?.toDto)}</div>
      <div className="mt-3">{cookie}</div>
      <div style={{ marginTop: 20 }}>
        <Stack gap={3} direction="horizontal">
          <ExButton onClick={onBindTiwitter} loading={bindTwitterLoading}>
            Bind Twitter
          </ExButton>

          <ExButton onClick={onBindDiscord} loading={bindDiscordLoading}>
            Bind Discord
          </ExButton>

          <ExPopover
            onButtonBuilder={function (open) {
              return (
                <ExButton loading={removeBindLoading}>Remove Bind</ExButton>
              );
            }}
            onPopoverBuilder={function (closeHandle) {
              return (
                <ExPopoverBox>
                  <ExPopoverMenu
                    title={'Twitter'}
                    onClick={() => {
                      onRemoveBind('twitter');
                      closeHandle();
                    }}
                  />
                  <ExPopoverMenu
                    title={'Discord'}
                    onClick={() => {
                      onRemoveBind('discord');
                      closeHandle();
                    }}
                  />
                </ExPopoverBox>
              );
            }}
          />

          <ExButton onClick={onGetCookie}>GetCookie</ExButton>

          <ExButton onClick={onRefreshToken} loading={refreshLoading}>
            Refresh Token
          </ExButton>
        </Stack>
      </div>
    </>
  );
}
