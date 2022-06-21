import { NextPage } from "next";
import styles from './Header.module.scss';

const Header: NextPage = () => {

  return (
    <div className={styles.header}>
      <div>Logo</div>
      <ul className={styles.headerNav}>
        <li>文章</li>
        <li>项目</li>
        <li>简历</li>
      </ul>
    </div>
  );
};

export default Header;