// types
import type { NextPageWithLayout } from './_app';
import type { ReactElement } from 'react';

// styles
import styles from '../styles/Projects.module.scss';

// utils
import { GetStaticProps } from 'next';
import { getProjectsInfo, IProjectInfo } from '../models/projects';

// components
import Header from '../components/CompactHeader';
import Layout from '../components/Layout';
import Link from 'next/link';

export const getStaticProps: GetStaticProps = async() => {
  const projectsInfo = await getProjectsInfo();

  return {
    props: {
      projectsInfo
    }
  }
}

const Projects: NextPageWithLayout = (props: { projectsInfo?: { [key: string]: IProjectInfo[] } }) => {
  const info = props.projectsInfo!;

  return (
    <main className={styles.container}>
      {
        Object.keys(info).map(projectCategory => (
          <section key={projectCategory} className={styles.section}>
            <h2>{ projectCategory.replace(/^\S/, s => s.toUpperCase()) }</h2>

            <div className={styles.inner}>
              {
                info[projectCategory].map(proj => (
                  <div key={proj.name} className={styles.item}>
                    <Link href={proj.url} target="_blank">
                      <i className={`${proj.icon}`} />
                    </Link>
                    <div className={styles.right}>
                      <div className={styles.title}>
                        <Link href={proj.url} target="_blank">
                          {proj.name}
                        </Link>
                      </div>
                      <div className={styles.desc}>{proj.desc}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </section>
        ))
        
      }
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