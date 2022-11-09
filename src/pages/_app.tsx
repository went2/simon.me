import '../styles/global.scss';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Layout from '../components/Layout';

function App({ Component, pageProps }: AppProps) {
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

  const siteTitle = `WestDoor ${title}`;

  return (
    <>
      <Head>
        <link rel="icon" type='image/x-icon' href='/favicon.ico' />
        <title>{siteTitle}</title>
      </Head>
      <Layout>
        <Script src="https://kit.fontawesome.com/db1b573488.js" crossOrigin="anonymous" />
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default App;
