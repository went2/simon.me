//types
import type { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
// styles
import styles from "../../styles/PostDetail.module.scss";

import { GetStaticPaths, GetStaticProps } from "next";
import { getPostIds, getPostInfoById, TPost } from "../../models/posts";

// components
import Header from "../../components/CompactHeader";
import Layout from "../../components/Layout";

// return a list of possible value for id
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const detail = await getPostInfoById(params!.id as string);
  return {
    props: {
      detail,
    },
  };
};

const Post: NextPageWithLayout = (props: { detail?: TPost }) => {
  const detail = props.detail as TPost;

  return (
    <main className={styles.container}>
      <div className={styles.date}>{detail.date}</div>
      <div dangerouslySetInnerHTML={{ __html: detail.htmlContent as string }} />
    </main>
  );
};

Post.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Header />
      {page}
    </Layout>
  );
};

export default Post;
