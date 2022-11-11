import { NextPage } from "next";
import styles from './Header.module.scss';
import Link from 'next/link';
import { INavItem } from '../../utils/navbar';

const navList: INavItem[] = [
  { name: '/ 项目', path: '/projects', icon: 'fa fa-product-hunt' },
  { name: '/ 文章', path: '/articles', icon: 'fa fa-book' },
  { name: '/ 关于我', path: '/about', icon: 'fa fa-at' },
];

const Header: NextPage = () => {
  return (
    <header className={styles.header}>
      <section className={styles.headerNav}>
        <div className={styles.navTop}>
          <h1>
            <Link href='/'>Simon Fisher</Link>
          </h1>
          <div className={styles.navLinks}>
            <ul>
              {
                navList.map((item, index) => (
                  <li key={index}>
                    <Link href={item.path}>
                       {item.name}
                    </Link>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
        <p className={styles.indexAbout}>
          我是一名前端工程师，大学就读教育技术学专业，毕业后在K12教育培训公司从事过教学设计、产品运营等工作。后自学前端开发，开发过后台管理系统、H5小游戏、移动端页面、小程序等应用。
        </p>
      </section>
    </header>
  );
};

export default Header;