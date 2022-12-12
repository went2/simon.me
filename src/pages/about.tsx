// types
import type { NextPageWithLayout } from './_app';
import type { ReactElement } from 'react';

import { GetStaticProps } from 'next';
import { getFileInfoByName } from '../utils/processFile';

// components
import Header from '../components/CompactHeader';
import Layout from '../components/Layout';

export const getStaticProps: GetStaticProps = async() => {
  const fileData = await getFileInfoByName('docs', 'about');
  return {
    props: {
      fileData
    }
  }
}

const About: NextPageWithLayout = (props: { fileData?: { htmlContent: string } }) => {
  const { htmlContent } =  props.fileData!;
  return (
    <main className="mdContainer">
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent as string }}
      />
    </main>
  );
}

About.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Header />
      { page }
    </Layout>
  )
};

export default About;