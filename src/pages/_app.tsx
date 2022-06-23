import '../styles/global.scss';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import Head from 'next/head';
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
  }, [])

  return (
    <>
      <Head>
        <link rel="icon" type='image/x-icon' href='/favicon.ico' />
        <title>WestDoor {title}</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default App;
