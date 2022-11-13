import { NextPage } from "next";

// components
import Footer from '../Footer';

const Layout: NextPage<any> = ({ children }) => {

  return (
    <>
      <main>{ children }</main>
      <Footer />
    </>
  ); 
};

export default Layout;