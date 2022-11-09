import { NextPage } from "next";
import styles from './Layout.module.css';

// components
import Header from '../Header';

const Layout: NextPage<any> = ({ children }) => {

  return (
    <>
      <Header />
      { children }
      {/* <footer>
        <div>
          powered by next.js
        </div>
      </footer> */}
    </>
  ); 
};

export default Layout;