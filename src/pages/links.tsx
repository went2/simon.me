// types
import type { NextPageWithLayout } from './_app';
import type { ReactElement } from 'react';

import { GetStaticProps } from 'next';
import { getFileInfoByName } from '../utils/processFile';

// components
import Header from '../components/CompactHeader';
import Layout from '../components/Layout';

export const getStaticProps: GetStaticProps = async() => {
  const fileData = await getFileInfoByName('docs', 'links');

  return {
    props: {
      fileData
    }
  }
}

const Links: NextPageWithLayout = (props: { fileData?: { htmlContent: string } }) => {
  const { htmlContent } =  props.fileData!;
  return (
    <main className="mdContainer">
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent as string }}
      />
    </main>
  );
}

Links.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Header />
        { page }
    </Layout>
  )
}

export default Links;