// types
import type { NextPageWithLayout } from './_app';
import type { ReactElement } from 'react';

// styles
import styles from '../styles/Articles.module.scss';

// api&utils
import { GetStaticProps } from 'next';
import { getSortedArticleList, IArticle } from '../utils/articles';
import { getAllSortedPosts, TPost } from '../models/posts';
import Date from '../components/Date';

// components
import Link from 'next/link';
import Header from '../components/CompactHeader';
import Layout from '../components/Layout';

// pre-rendering
export const getStaticProps: GetStaticProps = async (context) => {
  const articleList = getAllSortedPosts();
  // console.log('posts in view', articleList);
  
  return {
    props: {
      articleList
    }
  }
};

const Articles: NextPageWithLayout = (props: { articleList?: Array<TPost> }) => {
  return (
    <div className={styles.articleWrapper}>
      <aside className={styles.sideBar}>
        <div className={styles.categoryList}>
          <header className={styles.categoryHeader}>分类</header>
          <div className={styles.categoryItem}>笔记</div>
          <div className={styles.categoryItem}>感想</div>
          <div className={styles.categoryItem}>备忘</div>
        </div>
      </aside>
      <main className={styles.articleList}>
        {
          props.articleList!.map(({ id, date, title, abstract, category }) => (
            <article key={id} className={styles.article}>
              <header>
                <div className={styles.articleDate}>
                  <Date dateString={date} />
                  <div>分类：{category}</div>
                </div>
                <Link href={`/articles/${id}`} className={styles.articleTitle}>
                  {title}
                </Link>
              </header>
              <div className={styles.articleAbstract}>{abstract}</div>
            </article>
          ))
        }
      </main>
    </div>
  );
};

Articles.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Header />
      { page }
    </Layout>
  )
}

export default Articles;