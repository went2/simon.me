import { NextPage } from "next";
import styles from './Layout.module.css';

// components
import Header from '../Header';
import Footer from '../Footer';

const Layout: NextPage<any> = ({ children }) => {

  return (
    <>
      <Header />
      { children }
      <Footer />
    </>
  ); 
};

export default Layout;