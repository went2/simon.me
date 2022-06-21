import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../components/Layout";
import { getArticleIds, getArticleDetail, IArticle } from '../../utils/articles';

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
    <Layout>
      { detail.date }
      <br />
      { detail.title }
      <br />
      { detail.abstract }
      <br />
      <div
        dangerouslySetInnerHTML={{__html: detail.htmlContent as string}}
      />
    </Layout>
  );
};

export default Article;