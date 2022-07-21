import type { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';

import 'bootstrap/dist/css/bootstrap.css';
import '@/styles/globals.css';
import '@/styles/theme-bootstrap.css';
import '@/styles/theme-3devkit.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || (page => page);

  return <>{getLayout(<Component {...pageProps} />)}</>;
}

export default MyApp;
