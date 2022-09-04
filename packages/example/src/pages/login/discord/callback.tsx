import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAsyncEffect } from 'ahooks';
import { useAuth, useMyInfo } from '@3auth/react';

export default function Page() {
  return <BindDiscordView />;
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <>{page}</>;
};

export const useOAuthParam = () => {
  const router = useRouter();

  return router.query as {
    state: string;
    code: string;
  };
};

function BindDiscordView() {
  const router = useRouter();

  const param = useOAuthParam();

  const isParamError = !param.state || !param.code;

  const auth = useAuth();

  const [loading, setIsLoading] = useState<boolean>(false);

  const [bindStatus, setBindStatus] = useState<'success' | 'error'>();

  const { reload } = useMyInfo();

  useAsyncEffect(async () => {
    if (isParamError) return;

    setIsLoading(true);

    const redirectUrl = await auth.bindDiscord(param);

    setBindStatus(redirectUrl ? 'success' : 'error');

    reload();

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
