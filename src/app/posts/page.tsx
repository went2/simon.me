
import PostsContent from './postsContent';

import { getAllSortedPosts } from '../../models/posts';

async function getPostList() {
  const postList = await getAllSortedPosts();
  // [{category: 'essays'}] to { 'essays':[] }
  const result: any = {};
  for(const item of postList) {
    if(!result[item.category]) {
      result[item.category] = []
    }
    result[item.category].push(item);
  }
  return result;
}

export default async function PostsPage() {
  const posts = await getPostList();
  return (
    <PostsContent categoriedPosts={posts}></PostsContent>
  );
}