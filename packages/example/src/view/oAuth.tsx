import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useAsyncEffect, useCreation } from 'ahooks';
import { useAuth, useMyInfo, OAuth, ParamVo } from '@3auth/react';
import { Web3AuthProvider } from '@/view/AuthProvider';
import { BusinessError } from '@3auth/helpers';
import { ExButton, ExLoading } from '@3lib/components';
import Link from 'next/link';
import styles from './oAuth.module.scss';
import { Container } from 'react-bootstrap';

export function AuthWrapper(props: React.PropsWithChildren<unknown>) {
  const [namespace, setNamespace] = useState<string | undefined | null>(null);

  const router = useRouter();

  useEffect(() => {
    setNamespace(OAuth.getBindNamespace());
  }, []);

  return (
    <Container className={styles.CallbackPage}>
      {router.isReady && namespace !== null && (
        <Web3AuthProvider namespace={namespace}>
          {props.children}
        </Web3AuthProvider>
      )}
    </Container>
  );
}

export type OAuthErrorInfo =
  | { type: 'Denied' }
  | { type: 'Other'; error: BusinessError };

export function OAuthCallbackView<T extends ParamVo>(props: {
  paramVo: T;
  onBindFun: () => Promise<void>;
  onErrorText: (errorInfo: OAuthErrorInfo) => string;
}) {
  const { paramVo, onBindFun, onErrorText } = props;

  const router = useRouter();

  const auth = useAuth();

  const { reload } = useMyInfo();

  const redirectUrl = useCreation(() => {
    return OAuth.getRedirectUrl();
  }, []);

  const [displayView, setDisplayView] = useState<React.ReactNode>();

  const [loading, setIsLoading] = useState<boolean>(false);

  function onError(errorInfo: OAuthErrorInfo) {
    const errorText = onErrorText(errorInfo);

    setDisplayView(<Error redirectUrl={redirectUrl}>{errorText}</Error>);
  }

  useAsyncEffect(async () => {
    if (loading) return;

    if (paramVo.isDenied) {
      onError({ type: 'Denied' });
      return;
    }

    if (paramVo.isSuccess) {
      setIsLoading(true);

      try {
        await onBindFun();

        reload();

        router.replace(redirectUrl);
      } catch (error) {
        if (error instanceof BusinessError) {
          onError({ type: 'Other', error });
        }
      }

      setIsLoading(false);
    }
  }, [auth]);

  if (loading) {
    return (
      <div className={styles.loadingBox}>
        <ExLoading />
      </div>
    );
  }

  return <>{displayView}</>;
}

function Error(props: React.PropsWithChildren<{ redirectUrl: string }>) {
  return (
    <div className={styles.Error}>
      <div className={styles.title}>Authorization result</div>
      <div className={styles.text}>{props.children}</div>
      <Link href={props.redirectUrl} replace>
        <ExButton variant="light">Go Back</ExButton>
      </Link>
    </div>
  );
}
