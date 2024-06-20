import PageContent from './pageContent';

import { getPostIdList, getPostInfoById } from "../../../models/posts";

export const dynamicParams = true;

export async function generateStaticParams() {
  return getPostIdList();
}

async function getPost(params: { id: string }) {
  console.log('===========getPost params', params)
  const post = await getPostInfoById(params.id);
  return post;
}

type DetailPagePropsType = {
  params: {
    id: string
  }
}

export default async function DetailPage({params}: DetailPagePropsType) {
  const post = await getPost(params);
  return <>
    <PageContent detail={post} />
  </>
}