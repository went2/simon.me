//types
import type { NextPageWithLayout } from './_app';
import type { ReactElement } from 'react';

// styles
import styles from '../styles/Home.module.scss';

// components
import Header from '../components/Header';
import Layout from '../components/Layout';

const Home: NextPageWithLayout = () => {
  return (
    <main className={styles.home}>
      <div className={styles.title}>
        <p>WEST DOOR</p>
      </div>
      <div className={styles.quote}>
        <div>耶稣在加利利海边行走的时候，看见兄弟二人，就是名叫彼得的<strong>西门</strong>和他的弟弟安得烈，正在把网撒到海里去；他们是渔夫。耶稣就对他们说：“来跟从我，我要使你们作得人的渔夫。”他们立刻撇下网，跟从了他。</div>
        <div className={styles.source}>
          <p>马太福音：4:18-20</p>
        </div>
      </div>
    </main>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Header />
      { page }
    </Layout>  
  )
}

export default Home;