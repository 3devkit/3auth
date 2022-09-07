import React from 'react';
import { useRouter } from 'next/router';
import { useAuth, TwitterParamVo, TwitterParamDto } from '@3auth/react';
import { AuthWrapper, OAuthCallbackView, OAuthErrorInfo } from '@/view/oAuth';

export default function Page() {
  return <PageConnent />;
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthWrapper>{page}</AuthWrapper>;
};

function PageConnent() {
  const paramVo = useOAuthParam();

  const auth = useAuth();

  return (
    <OAuthCallbackView
      paramVo={paramVo}
      onBindFun={async () => {
        return await auth.bindTwitter(paramVo.getBindParam());
      }}
      onErrorText={(errorInfo: OAuthErrorInfo) => {
        if (errorInfo.type === 'Denied') {
          return 'You declined the authorization';
        }
        switch (errorInfo.error.code) {
          case 70:
            return 'The twitter has been bound to another wallet address and cannot be bound repeatedly';
          default:
            return errorInfo.error.message;
        }
      }}
    />
  );
}

export const useOAuthParam = () => {
  const router = useRouter();

  const dto = router.query as TwitterParamDto;

  return new TwitterParamVo(dto);
};
