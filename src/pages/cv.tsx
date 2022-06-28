import { NextPage } from 'next';
import styles from '../styles/Cv.module.scss';
import CollapseContent from '../components/CollapseContent';

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

      <CollapseContent title='个人总结'>
        本科与硕士就读教育技术学专业，毕业后在教育服务公司先后从事教学设计、产品运营等工作，后花半年时间学习前端开发相关知识与技能，目前从事前端开发，有后台管理系统、H5小游戏、移动端H5等类型应用的开发经验。
      </CollapseContent>

      <div className={styles.panel}></div>

      <div className={styles.panel}></div>
      <div className={styles.panel}></div>
      <div className={styles.panel}></div>
    </main>
  );
};

export default Cv;