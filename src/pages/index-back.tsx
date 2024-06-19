//types
import type { NextPageWithLayout } from './_app-back';
import type { ReactElement } from 'react';

// styles
import styles from '../styles/Home.module.scss';

// components
import Link from 'next/link';
import Header from '../components/Header';
import Layout from '../components/Layout';

// utils
import type { GetStaticProps } from 'next';
import { getAllSortedPosts, TPost } from '../models/posts';

// pre-rendering
export const getStaticProps: GetStaticProps = async() => {
  const postList = await getAllSortedPosts();

  // [{year: '2021'}] to { '2021':[] }
  const result: any = {};
  for(const item of postList) {
    if(!result[item.year]) {
      result[item.year] = []
    }
    result[item.year].push(item);
  }

  // console.log('result------', result);
  
  return {
    props: {
      sortedPosts: result
    }
  }
}

const Home: NextPageWithLayout = (props: { sortedPosts?: { [key: string]: Array<TPost> } }) => {
  const posts = props.sortedPosts!;
  return (
    <main className={styles.container}>
      {
        Object.keys(posts).reverse().map(year =>(
          <section key={year} className={styles.section}>
            <div className={styles.sectionTitle}>{ year }</div>
            <div className={styles.sectionList}>
              {
                posts[year].map(post => (
                  <div key={post.id} className={styles.postItem}>
                    <h3>
                      <Link href={`/post/${post.id}`} className={styles.postItemTitle}>
                        {post.title}
                      </Link>
                      <span className={styles.postDate}>{post.date}</span>
                    </h3>
                    <p className={styles.postDesc}>{post.abstract}</p>
                  </div>
                ))
              }
            </div>
          </section>
        ))
      }
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