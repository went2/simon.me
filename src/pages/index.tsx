import { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { useState, useEffect } from 'react';

const Home: NextPage = () => {
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
    <div>
      <Head>
        <title> 
        WestDoor is {title}
        </title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          The WestDoor
        </h1>
        <small>not northdoor</small>
        <nav>

        </nav>
        <article>

        </article>
      </main>

      <footer>

      </footer>
    </div>
  );
};

export default Home;