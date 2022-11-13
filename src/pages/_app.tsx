// types
import type { ReactElement, ReactNode } from 'react';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';

// css
import '../styles/global.scss';

// components
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';

export type NextPageWithLayout<P={}, IP=P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [title, setTitle] = useState('Open');

  useEffect(() => {
    // browser api need to be execucted in useEffect
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        setTitle('Hidden');
      } else {
        setTitle('Open');
      }
    });
  }, []);

  const getLayout = Component.getLayout ?? ((page) => page);

  const siteTitle = `WestDoor ${title}`;

  return (
    <>
      <Head>
        <link rel="icon" type='image/x-icon' href='/favicon.ico' />
        <title>{siteTitle}</title>
      </Head>
      <Script src="https://kit.fontawesome.com/db1b573488.js" crossOrigin="anonymous" />
      {
        getLayout(<Component {...pageProps} />)
      }
    </>
  );
};
