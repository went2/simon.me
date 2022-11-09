import { NextPage } from "next";
import styles from './Header.module.scss';
import Link from 'next/link';
import { INavItem } from '../../utils/navbar';

const navList: INavItem[] = [
  { name: '首页', path: '/', icon: 'fa fa-home' },
  { name: '文章', path: '/articles', icon: 'fa fa-book' },
  { name: '项目', path: '/projects', icon: 'fa fa-product-hunt' },
  { name: 'cv', path: '/cv', icon: 'fa fa-at' },
];


const Header: NextPage = () => {
  
  return (
    <header className={styles.header}>
      <section className={styles.headerNav}>
        <ul>
          {
            navList.map((item, index) => (
              <li key={index}>
                <Link href={item.path}>
                  <i className={item.icon}></i>
                  {'\u00A0'} {item.name}
                </Link>
              </li>
            ))
          }
        </ul>
      </section>
    </header>
  );
};

export default Header;