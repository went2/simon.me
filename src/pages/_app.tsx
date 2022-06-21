import '../styles/global.scss';
import type { AppProps } from 'next/app';
import {useState, useEffect} from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

function App({ Component, pageProps }: AppProps) {
  const [title, setTitle] = useState('Open');

  useEffect(() => {
    // browser api need to be execucted in useEffect
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        setTitle('Closed');
      } else {
        setTitle('Open');
      }
    });
  }, [])

  return (
    <>
      <Head>
        <title>WestDoor is {title}</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default App;
