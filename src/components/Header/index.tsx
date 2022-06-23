import { NextPage } from "next";
import styles from './Header.module.scss';
import Link from 'next/link';


const Header: NextPage = () => {

  return (
    <div className={styles.header}>
      <Link href='/'>
        <a>Logo</a>
      </Link>

      <ul className={styles.headerNav}>
        <li>
          <Link href='/articles'>
            <a>文章</a>
          </Link>
        </li>
        <li>
          <Link href='/projects'>
            <a>项目</a>
          </Link>
        </li>
        <li>
          <Link href='/resume'>
            <a>简历</a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;