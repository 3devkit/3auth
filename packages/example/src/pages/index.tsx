import React from 'react';
import { Container, Stack } from 'react-bootstrap';
import { Web3AuthProvider } from '@/view/AuthProvider';
import { LoginBox } from '@/view/LoginBox';
import Link from 'next/link';
import { ExButton } from '@3lib/components';

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
              <ExButton>NEW PAGE2</ExButton>
            </span>
          </Link>
        </Stack>
      </div>
    </Container>
  );
}
