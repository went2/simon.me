// types
import type { NextPageWithLayout } from './_app';
import type { ReactElement } from 'react';

// styles
import styles from '../styles/Links.module.scss';

// components
import Header from '../components/CompactHeader';
import Layout from '../components/Layout';

const Links: NextPageWithLayout = () => {
  return (
    <main className={styles.container}>
      <h1>链接</h1>
    </main>
  );
}

Links.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Header />
        { page }
    </Layout>
  )
}

export default Links;