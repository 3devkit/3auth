import React from 'react';
import { Container, Stack } from 'react-bootstrap';
import { useMyInfo } from '@3auth/react-ui';

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
  const { myInfo } = useMyInfo();

  return (
    <Container>
      <Stack gap={3} direction="horizontal">
        {myInfo?.account}
        {/* <LoginBox /> */}
      </Stack>
    </Container>
  );
}
