import Home from './components/home';
import Header from './components/header';
import Footer from './components/footer';
import { getAllSortedPosts } from '../models/posts'

async function getPosts() {
  const postList = await getAllSortedPosts();

  // [{year: '2021'}] to { '2021':[] }
  const result: any = {};
  for(const item of postList) {
    if(!result[item.year]) {
      result[item.year] = []
    }
    result[item.year].push(item);
  }
  // console.log('result------', result);
  return result;
}

export default async function Page() {
  const posts = await getPosts();
  return (
    <>
      <Header />
      <Home sortedPosts={posts}></Home>
      <Footer />
    </>
  );
}