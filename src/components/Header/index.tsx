import { NextPage } from "next";
import styles from './Header.module.scss';
import Link from 'next/link';
import { navList } from '../../models/navbar';
import throttle from "../../utils/throttle";

const Header: NextPage = () => {
  const rotate3dEffect = throttle((event: React.MouseEvent<HTMLHeadingElement>) => {
    const MOSTX = 12;
    const MOSTY = 12;

    const ele = event.target as HTMLHeadingElement;
    ele.style.transition = 'all .2s ease-in-out';
    
    const { offsetX, offsetY } = event.nativeEvent;
    const { width, height } = ele.getBoundingClientRect();
    const halfWidth = width/2;
    const halfHeight = height/2;

    // calculate angle
    const rotateX = ((offsetX - halfWidth ) / halfWidth) * MOSTX;
    const rotateY = ((offsetY - halfHeight) / halfHeight) * MOSTY;
    
    // set the rotation
    ele.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  }, 200);

  const setBack = (event: React.MouseEvent<HTMLHeadingElement>) => {
    const ele = event.target as HTMLHeadingElement;
    ele.style.transition = 'none';
    ele.style.transform = `rotateY(${0}deg) rotateX(${0}deg)`;
  }

  return (
    <header className={styles.header}>
      <section className={styles.headerNav}>
        <div className={styles.navTop}>
          <Link href='/'>
            <h1 onMouseMove={rotate3dEffect} onMouseLeave={setBack}>
              Simon Fisher
            </h1>
          </Link>
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
          我是 Simon，教育技术学硕士毕业，从事了几年教学设计、产品运营等工作，目前从事 Web 前端开发。
        </p>
      </section>
    </header>
  );
};

export default Header;