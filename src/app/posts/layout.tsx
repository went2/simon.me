import Header from '../components/compactHeader';
import Footer from '../components/footer';

type LayoutPropsType = {
  children: React.ReactNode
}

export default function PostsLayout({ children }: LayoutPropsType) {
  return (
    <>
      <Header />
      { children }
      <Footer />
    </>
  )
}