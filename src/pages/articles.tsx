import { NextPage } from 'next';
import Layout from '../components/Layout';

const Articles: NextPage = () => {
  return (
    <Layout>
      <article>
        <div>
          <h2>标题1</h2>
          <div>meta data of article</div>
          <p>
            一句话描述一句话描述一句话描述一句话描述一句话描述
          </p>
        </div>
      </article>
    </Layout>
  );
};

export default Articles;