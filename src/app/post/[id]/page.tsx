import PageContent from './pageContent';

import { getPostIdList, getPostInfoById } from "../../../models/posts";

export const dynamicParams = true;

export async function generateStaticParams() {
  return getPostIdList();
}

async function getPost(params: { id: string }) {
  const post = await getPostInfoById(params.id);
  return post;
}

type DetailPagePropsType = {
  params: {
    id: string
  }
}

export default async function DetailPage({params}: DetailPagePropsType) {
  // note: the data in params is URL encoded
  // eg: { id: '' } returned by getPostIdList is like { id: '%E8%AF%BB%E4%B9%A6' } in params
  const post = await getPost(params);
  return <>
    <PageContent detail={post} />
  </>
}