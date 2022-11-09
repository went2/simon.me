import { NextPage } from 'next';
import Link from 'next/link';
import { GetStaticProps, GetStaticPaths } from 'next'
import { getSortedArticleList, IArticle } from '../utils/articles';
import styles from '../styles/Articles.module.scss';
import Date from '../components/Date';

// pre-rendering
export const getStaticProps: GetStaticProps = async (context) => {
  const articleList = getSortedArticleList();

  return {
    props: {
      articleList
    }
  }
};

const Articles: NextPage = (props: { articleList?: Array<IArticle> }) => {
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
          props.articleList!.map(({ id, date, title, abstract }) => (
            <article key={id} className={styles.article}>
              <header>
                <div className={styles.articleDate}>
                  <Date dateString={date} />
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

export default Articles;