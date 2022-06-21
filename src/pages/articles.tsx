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

const Articles: NextPage = (props: {articleList?: Array<IArticle>}) => {
  return (
    <main className={styles.articleContainer}>
      {
        props.articleList!.map(({id, date, title, abstract}) => (
          <article key={id}>
            <small>
              <Date dateString={date} />
            </small>
            <br />
            <Link href={`/articles/${id}`}>
              <a>{title}</a>
            </Link>
            <br />
            <small>{abstract}</small>
          </article>
        ))
      }
    </main>
  );
};

export default Articles;