import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAsyncEffect } from 'ahooks';
import { useAuth } from '@3auth/react';

export default function Page() {
  return <PageConnent />;
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <>{page}</>;
};

function PageConnent() {
  const router = useRouter();

  const param = useOAuthParam();

  const isParamError = !param.oauth_token || !param.oauth_verifier;

  const auth = useAuth();

  const [loading, setIsLoading] = useState<boolean>(false);

  const [bindStatus, setBindStatus] = useState<'success' | 'error'>();

  useAsyncEffect(async () => {
    if (isParamError) return;

    setIsLoading(true);

    const redirectUrl = await auth.bindTwitter(
      param.oauth_token,
      param.oauth_verifier,
    );

    setBindStatus(redirectUrl ? 'success' : 'error');

    setIsLoading(false);

    if (redirectUrl) {
      router.replace(redirectUrl);
    }
  }, [auth, param, isParamError]);

  if (isParamError) return <>Param Error</>;

  if (bindStatus === 'error') return <>Bind Error</>;

  if (loading) return <>loading...</>;

  return <></>;
}

export const useOAuthParam = () => {
  const router = useRouter();

  return router.query as {
    oauth_token: string;
    oauth_verifier: string;
  };
};
