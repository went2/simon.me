import { NextPage } from 'next';
import styles from '../styles/Cv.module.scss';

const Cv: NextPage = () => {
  return (
    <main className={styles.cv}>
      <div className={styles.info}>
        <div className={styles.photo}></div>
        <div className={styles.baseInfo}>
          <h1>俞文韬</h1>
          <p>Front-End Engineer</p>
          <div className={styles.contact}>
            <p>569845499@qq.com | 上海</p>
          </div>
          <div className={styles.socialMedia}>
            <a href="https://github.com/went2">
              Github
            </a>
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>个人总结</div>
        <div className={styles.panelContent}>M.S. degree in Biology, worked as a research assistant and a science editor, before starting to build career in software developing. Spent one year in self-learning, then got accepted by San Francisco State University and granted M.S. degree in Computer Science. Now working on Android development as a software engineer.</div>
      </div>

      <div className={styles.panel}></div>

      <div className={styles.panel}></div>
      <div className={styles.panel}></div>
      <div className={styles.panel}></div>
    </main>
  );
};

export default Cv;