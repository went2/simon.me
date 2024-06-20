// types
import type { NextPageWithLayout } from "./_app-back";
import type { ReactElement } from "react";

import { GetStaticProps } from "next";
import { getFileContentByName } from "../utils/processFile";

// components
import Header from "../components/CompactHeader";
import Layout from "../components/Layout";

export const getStaticProps: GetStaticProps = async () => {
  const fileData = await getFileContentByName("docs", "about");
  return {
    props: {
      fileData,
    },
  };
};

const About: NextPageWithLayout = (props: {
  fileData?: { htmlContent: string };
}) => {
  const { htmlContent } = props.fileData!;
  return (
    <main className="mdContainer">
      <div dangerouslySetInnerHTML={{ __html: htmlContent as string }} />
    </main>
  );
};

About.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Header />
      {page}
    </Layout>
  );
};

export default About;
