import { NextPage } from 'next';
import Layout from '../components/Layout';
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
        <title>WestDoor is {title}</title>
      </Head>
      <Layout>
        <main>
          <div>THE WESTDOOR</div>
          <div>耶稣在加利利海边行走的时候，看见兄弟二人，就是名叫彼得的西门和他的弟弟安得烈，正在把网撒到海里去；他们是渔夫。 19 耶稣就对他们说：“来跟从我，我要使你们作得人的渔夫。” 20 他们立刻撇下网，跟从了他。</div>
          <div>————【马太福音：4:18-20】</div>
        </main>
      </Layout>
    </div>
  );
};

export default Home;