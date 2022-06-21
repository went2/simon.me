import { NextPage } from 'next';
import { GetStaticProps, GetStaticPaths } from 'next'
import { getSortedArticleList, IArticle } from '../utils/articles';
import styles from '../styles/Articles.module.scss';

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
            <div>{date}</div>
            <h2>{title}</h2>
            <p>{abstract}</p>
          </article>
        ))
      }
    </main>
  );
};

export default Articles;