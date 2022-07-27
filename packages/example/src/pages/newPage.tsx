import React from 'react';
import { Container, Stack } from 'react-bootstrap';
import { Web3AuthProvider } from '@/view/AuthProvider';
import { LoginBox } from '@/view/LoginBox';

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
    </Container>
  );
}
