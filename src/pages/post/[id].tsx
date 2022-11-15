import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { getArticleIds, getArticleDetail, IArticle } from '../../utils/articles';
import Date from '../../components/Date';
import styles from '../../styles/ArticleDetail.module.scss';

// return a list of possible value for id
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getArticleIds();
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const detail = await getArticleDetail(params!.id as string);
  return {
    props: {
      detail
    }
  }
}


const Article: NextPage = (props: { detail?: IArticle }) => {
  const detail = props.detail as IArticle;

  return (
    <main className={styles.container}>
      {/* <Date dateString={detail.date} /> */}

      <div
        dangerouslySetInnerHTML={{ __html: detail.htmlContent as string }}
      />
    </main>
  );
};

export default Article;