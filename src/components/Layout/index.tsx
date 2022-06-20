import { NextPage } from "next";

import styles from './Layout.module.css';

// components
import Header from '../Header';

const Layout: NextPage<any> = ({children}) => {

  return (
    <div>
      <Header />

      {children}
      <footer>
        <div>
          powered by next.js
        </div>
      </footer>
    </div>
  ); 
};

export default Layout;