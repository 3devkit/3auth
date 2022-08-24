import React, { useState } from 'react';
import { Container, Stack } from 'react-bootstrap';
import { Web3AuthProvider } from '@/view/AuthProvider';
import { LoginBox } from '@/view/LoginBox';
import Link from 'next/link';
import { ExButton } from '@3lib/components';
import { useAuth, useMyInfo } from '@3auth/react-ui';
import { useRouter } from 'next/router';

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
  const auth = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  async function onBindTiwitter() {
    setLoading(true);

    await auth.twitterLogin();

    setLoading(false);
  }

  return (
    <Container>
      <Stack gap={3} direction="horizontal">
        <LoginBox />
      </Stack>

      <div style={{ marginTop: 20 }}>
        <Stack gap={3} direction="horizontal">
          <Link href={'/newPage'}>
            <span>
              <ExButton>NEW PAGE</ExButton>
            </span>
          </Link>
          <Link href={'/newPage2'}>
            <span>
              <ExButton>MyInfo</ExButton>
            </span>
          </Link>
          <ExButton onClick={onBindTiwitter} loading={loading}>
            Bind Twitter
          </ExButton>
        </Stack>
      </div>
    </Container>
  );
}
