import React from 'react';
import { Container } from 'react-bootstrap';
import { Web3AuthProvider } from '@/view/AuthProvider';
import { LoginBox } from '@/view/LoginBox';

export default function Page() {
  return <PageConnent />;
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <LayoutConnent>{page}</LayoutConnent>;
};

function LayoutConnent(props: React.PropsWithChildren<unknown>) {
  return <Web3AuthProvider>{props.children}</Web3AuthProvider>;
}

function PageConnent() {
  return (
    <Container>
      <LoginBox />
    </Container>
  );
}
