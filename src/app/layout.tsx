
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

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  const [status, setStatus] = useState('Open');
  const siteTitle = `WestDoor ${status}`;

  useEffect(() => {
    // browser api need to be execucted in useEffect
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        setStatus('Hidden');
      } else {
        setStatus('Open');
      }
    });
  }, []);

  return (
    <html lang='en'>
      <Head>
        <link rel="icon" type='image/x-icon' href='/favicon.ico' />
        <title>{ siteTitle }</title>
      </Head>
      <Script src="https://kit.fontawesome.com/db1b573488.js" crossOrigin="anonymous" />

      <body> { children } </body>
    </html>
  )
}