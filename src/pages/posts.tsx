// types
import type { NextPageWithLayout } from './_app';
import type { ReactElement } from 'react';

// styles
import styles from '../styles/Posts.module.scss';

// api&utils
import { GetStaticProps } from 'next';
import { getAllSortedPosts, TPost } from '../models/posts';

// components
import Link from 'next/link';
import Header from '../components/CompactHeader';
import Layout from '../components/Layout';

// pre-rendering
export const getStaticProps: GetStaticProps = async (context) => {
  const postList = await getAllSortedPosts();

  // [{category: 'essays'}] to { 'essays':[] }
  const result: any = {};
  for(const item of postList) {
    if(!result[item.category]) {
      result[item.category] = []
    }
    result[item.category].push(item);
  }

  return {
    props: {
      categoriedPosts: result
    }
  }
};

const categoryI18n: any =  {
  essays: '随笔',
  notes: '笔记',
  references: '参考',
  translations: '翻译',
  coffee: '烘咖啡'
}

const Posts: NextPageWithLayout = (props: { categoriedPosts?: { [key: string]: Array<TPost> } }) => {
  const posts =  props.categoriedPosts!;
  return (
    <div className={styles.container}>
      <main className={styles.list}>
        {
          Object.keys(posts).map(category => {
            return (
              <section key={category} className={styles.section}>
                <div id={category} className={styles.sectionTitle}>{ categoryI18n[category] }</div>
                <div className={styles.sectionList}>
                  {
                    posts[category].map(post => (
                      <h3 key={post.id}>
                        <Link href={`/post/${post.id}`} className={styles.postItemTitle}>
                          {post.title}
                        </Link>
                      </h3>
                    ))
                  }
                </div>
              </section>
            );
          })
        }
      </main>
    </div>
  );
};

Posts.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Header />
      { page }
    </Layout>
  )
}

export default Posts;