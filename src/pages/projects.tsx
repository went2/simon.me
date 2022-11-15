// types
import type { NextPageWithLayout } from './_app';
import type { ReactElement } from 'react';

// styles
import styles from '../styles/Projects.module.scss';

// components
import Header from '../components/CompactHeader';
import Layout from '../components/Layout';

const Projects: NextPageWithLayout = () => {
  return (
    <main className={styles.container }>
      项目页面
    </main>
  )
};

Projects.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Header />
      { page }
    </Layout>  
  )
}

export default Projects;