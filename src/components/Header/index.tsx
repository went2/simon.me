import { NextPage } from "next";
import styles from './Header.module.scss';
import Link from 'next/link';

const Header: NextPage = () => {

  return (
    <div className={styles.header}>
      <Link href='/'>
        首页
      </Link>

      <ul className={styles.headerNav}>
        <li>
          <Link href='/articles'>
            文章
          </Link>
        </li>
        <li>
          <Link href='/projects'>
            项目
          </Link>
        </li>
        <li>
          <Link href='/cv'>
            CV
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;