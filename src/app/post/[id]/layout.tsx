
// components
import Header from '../../components/compactHeader';
import Footer from '../../components/footer';

import type { LayoutPropsType } from '../../types'

export default function PostDetailLayout({children}: LayoutPropsType) {
  return (
    <>
      <Header />
      { children }
      <Footer />
    </>
  );
}