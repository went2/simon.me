import { NextPage } from "next";
import styles from './Header.module.scss';
import Link from 'next/link';

const Header: NextPage = () => {

  return (
    <header className={styles.header}>
      <section className={styles.headerNav}>
        <ul>
          <li>
            <Link href='/'>首页</Link>
          </li>
          <li>
            <Link href='/articles'>文章</Link>
          </li>
          <li>
            <Link href='/projects'>项目</Link>
          </li>
          <li>
            <Link href='/cv'>CV</Link>
          </li>
        </ul>
      </section>
    </header>
  );
};

export default Header;