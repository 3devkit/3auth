import React, { useState } from 'react';
import { Container, Stack } from 'react-bootstrap';
import { LoginBox } from '@/view/LoginBox';
import { ExButton } from '@3lib/components';
import { useAuth, useLoginState, useMyInfo } from '@3auth/react-ui';
import Link from 'next/link';
import { Web3AuthProvider } from '@/view/AuthProvider';

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

  const [loading, setLoading] = useState<boolean>(false);

  async function onBindTiwitter() {
    setLoading(true);

    await auth.twitterLogin();

    setLoading(false);
  }

  const { myInfo } = useMyInfo();

  return (
    <>
      <div className="mt-3">{JSON.stringify(myInfo?.toDto)}</div>
      <div style={{ marginTop: 20 }}>
        <Stack gap={3} direction="horizontal">
          <ExButton onClick={onBindTiwitter} loading={loading}>
            Bind Twitter
          </ExButton>
        </Stack>
      </div>
    </>
  );
}
