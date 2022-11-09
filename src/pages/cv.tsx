import { NextPage } from 'next';
import Image from 'next/image';
import styles from '../styles/Cv.module.scss';
import CollapseContent from '../components/CollapseContent';
import JobTitle from '../components/CvContent/JobTitle';
import CompanyName from '../components/CvContent/CompanyName';
import WorkingYear from '../components/CvContent/WorkingYear';

const Cv: NextPage = () => {
  return (
    <main className={styles.cv}>
      <div className={styles.info}>
        <div className={styles.photo}></div>
        <div className={styles.baseInfo}>
          <div className={styles.title}>
            <strong className={styles.name}>俞文韬</strong>
            <div className={styles.job}>Front-End Engineer</div>
          </div>
          <div className={styles.items}>
            <div className={styles.item}>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3795" width="18" height="18">
                <path d="M853.333333 170.666667 170.666667 170.666667C123.733333 170.666667 85.333333 209.066667 85.333333 256l0 512c0 46.933333 38.4 85.333333 85.333333 85.333333l682.666667 0c46.933333 0 85.333333-38.4 85.333333-85.333333L938.666667 256C938.666667 209.066667 900.266667 170.666667 853.333333 170.666667zM853.333333 768l-85.333333 0L768 392.533333 512 554.666667 256 392.533333 256 768 170.666667 768 170.666667 256l51.2 0 290.133333 179.2L802.133333 256 853.333333 256 853.333333 768z" p-id="3796" fill="#2c2c2c"></path>
              </svg>
              simonfisher227@gmail.com
            </div>
            <div className={styles.item}>
              <svg viewBox="0 0 1024 1024" version="1.1" fill="#2c2c2c" xmlns="http://www.w3.org/2000/svg" p-id="4051" xmlnsXlink="http://www.w3.org/1999/xlink" width="18" height="18">
                <path d="M661.333333 42.666667l-341.333333 0C261.12 42.666667 213.333333 90.453333 213.333333 149.333333l0 725.333333C213.333333 933.546667 261.12 981.333333 320 981.333333l341.333333 0c58.88 0 106.666667-47.786667 106.666667-106.666667l0-725.333333C768 90.453333 720.213333 42.666667 661.333333 42.666667zM490.666667 938.666667c-35.413333 0-64-28.586667-64-64s28.586667-64 64-64 64 28.586667 64 64S526.08 938.666667 490.666667 938.666667zM682.666667 768 298.666667 768 298.666667 170.666667l384 0L682.666667 768z" p-id="4052"></path>
              </svg>
              18521710097
            </div>
            <div className={styles.item}>
              <svg fill="#2c2c2c" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4925" xmlnsXlink="http://www.w3.org/1999/xlink" width="18" height="18">
                <path d="M941.714 512q0 143.433-83.712 258.011t-216.283 158.574q-15.433 2.853-22.565-3.986t-7.131-17.152v-120.576q0-55.442-29.696-81.152 32.585-3.438 58.587-10.277t53.723-22.272 46.299-37.998 30.281-60.014 11.703-86.016q0-69.157-45.129-117.723 21.138-52.005-4.571-116.553-16.018-5.157-46.299 6.29t-52.553 25.161l-21.723 13.714q-53.138-14.848-109.714-14.848t-109.714 14.848q-9.143-6.29-24.283-15.433t-47.726-22.016-49.152-7.717q-25.161 64.585-3.986 116.553-45.129 48.567-45.129 117.723 0 48.567 11.703 85.723t29.989 60.014 46.007 38.29 53.723 22.272 58.587 10.277q-22.857 20.553-28.014 58.843-11.995 5.705-25.71 8.558t-32.585 2.853-37.413-12.288-31.707-35.73q-10.862-18.286-27.721-29.696t-28.27-13.714l-11.447-1.719q-11.995 0-16.567 2.56t-2.853 6.583 5.157 8.009 7.424 6.839l3.986 2.853q12.581 5.705 24.869 21.723t17.993 29.147l5.705 13.129q7.424 21.723 25.161 35.145t38.29 17.152 39.717 3.986 31.707-2.011l13.129-2.304q0 21.723 0.293 50.871t0.293 30.866q0 10.277-7.424 17.152t-22.857 3.986q-132.571-43.995-216.283-158.574t-83.712-258.011q0-119.442 58.843-220.27t159.707-159.707 220.27-58.843 220.27 58.843 159.707 159.707 58.843 220.27z" p-id="4926"></path>
              </svg>
              <a href="https://github.com/went2">
                https://github.com/went2
              </a>
            </div>
          </div>
        </div>
      </div>

      <CollapseContent title='个人简介'>
        教育技术学硕士毕业，在教育公司从事教学设计、产品运营等工作。后自学前端开发技术，目前从事前端开发，开发过后台管理系统、H5小游戏、移动端H5、小程序等应用的界面。
      </CollapseContent>

      <CollapseContent title='工作经历'>
        <section className={styles.expContainer}>
          <header className={styles.expHeader}>
            <JobTitle>前端开发工程师</JobTitle>
            <CompanyName>上海胜者教育有限公司 | 在线学堂部</CompanyName>
            <WorkingYear>2021年8月 – 2022年5月</WorkingYear>
          </header>

          <div className={styles.expDes}>
            <p>就职期间参与以下类型项目开发：</p>

            <section className={styles.jobDes}>
              <p><strong>1. 后台管理系统</strong></p>
              <p>概述：公司内部的销售、财务、客服等人员使用的后台管理系统，有订单管理、财务管理、教务管理等功能，前后端分离，前端技术栈 Vue2 + TypeScript + AntDesign Vue。</p>
              <p>我的角色：中途接手项目，接手时项目已有完善的基础架构（权限管理、动态路由、通用业务组件等），了解基础架构后，我继续进行业务页面的开发，直至项目上线。</p>
              <p>项目周期：2021.8-2021.11</p>
            </section>

            <section className={styles.jobDes}>
              <p><strong>2.	H5 小游戏</strong></p>
              <p>概述：在移动端玩的 H5 小游戏。使用 Egret 引擎开发，build成压缩包，在 App 端下载使用。</p>
              <p>我的角色：调研与独立开发H5小游戏：前期花4天调研 Egret 系列工具（引擎API、龙骨动画制作工具），开发周期内与产品经理沟通需求，设计小游戏状态、资源、视图的管理，完成3个小游戏开发与部署。期间对 Egret 引擎Api、DragonBone 龙骨动画有较多使用。</p>
              <p>项目周期：2021.11-2021.12</p>
            </section>

            <section className={styles.jobDes}>
              <p><strong>3.	移动端 H5 应用</strong></p>
              <p>概述：公司的移动端 App 应用中的部分模块要用 H5 方式重构，需要前端开发相应的移动端页面，build成压缩包，在 App 端下载呈现，使用Vue2 + TypeScript + Vant UI。</p>
              <p>我的角色：负责项目的设计、开发与上线：前期与产品沟通项目需求，根据需求设计项目文件结构，做了一些基础封装（网络请求、通用业务组件等），在此基础上开发了两个业务模块，并上线交付。</p>
              <p>项目周期：2022.3-2022.5</p>
            </section>

          </div>
        </section>

        <section className={styles.expContainer}>
          <header className={styles.expHeader}>
            <JobTitle>教学设计师</JobTitle>
            <CompanyName>上海乐好教育科技有限公司 | 运营部</CompanyName>
            <WorkingYear>2018年3月 – 2021年6月</WorkingYear>
          </header>

          <div className={styles.expDes}>
            <p>就职期间担任教学设计师，执行公司教师培训项目。后转为产品运营，为公司的教学评价app、培训管理后台的做运营支持，工作内容包括：</p>

            <section className={styles.jobDes}>
              <p><strong>1.	培训项目管理</strong></p>
              <ul>
                <li>参与学校培训需求沟通，参与撰写培训方案、制作预算，推动客户签订合同。</li>
                <li>安排培训计划，策划主持项目启动会。</li>
                <li>按计划执行每次培训活动，撰写新闻稿、月报、学期小结，发布到公司新闻平台，反馈给客户学校。</li>
              </ul>

            </section>

            <section className={styles.jobDes}>
              <p><strong>2.	教学设计与开发(K12班会课程)</strong></p>
              <ul>
                <li>前期策划与专家沟通：参与规划课程的整体目标与课时主题；制作课程开发预算与开发进度计划；与内容专家沟通确定开发规范与样例；建立项目管理文档，分配开发工作。</li>
                <li>内容开发：根据课程样例，开发各个课时的课程内容，积极征询专家意见以保证内容的质量。</li>
                <li>打包与发布：撰写课程产品说明文档，将工作内容包装成可供教师直接使用的形式。</li>
                <li>使用与反馈：课程试用阶段教师的反馈意见，着手第二版开发规划。</li>
              </ul>
            </section>

            <section className={styles.jobDes}>
              <p><strong>3.	媒体运营</strong></p>
              <ul>
                <li>微信公众号运营：撰写公司微信公众号运营规范文档；计划公众号的栏目设置、内容来源、推送频率；文案采编与推送；阅读数统计分析。</li>
                <li>公司官网、App运营：参与等账号开设、使用培训、使用问答、平台资源管理等基础运营及客服支持工作。</li>
              </ul>
            </section>
          </div>
        </section>

        <section className={styles.expContainer}>
          <header className={styles.expHeader}>
            <JobTitle>教学设计师</JobTitle>
            <CompanyName>上海思创网络科技有限公司 | 课程运营部</CompanyName>
            <WorkingYear>2017年7月 – 2018年2月</WorkingYear>
          </header>

          <div className={styles.expDes}>
            <p>就职期间担任教学设计师，工作内容包括：</p>
            <section className={styles.jobDes}>
              <ul>
                <li>售前方案支持：根据公司的业务项目，为客户定制员工培训方案，与市场部同事协作，促进订单签订。</li>
                <li>企业培训微课脚本设计：根据客户需求，萃取培训文本内容，设计微课脚本，与Flash开发人员合作，完成微课成品。</li>
                <li>移动学习平台基础运营：参与企业微信公众号服务平台的功能测试、平台部署等工作。</li>
              </ul>
            </section>

          </div>
        </section>

        <section className={styles.expContainer}>
          <header className={styles.expHeader}>
            <JobTitle>教学设计师（实习）</JobTitle>
            <CompanyName>无锡睿泰科技有限公司 | 课程研发部</CompanyName>
            <WorkingYear>2016年7月 – 2016年9月</WorkingYear>
          </header>

          <div className={styles.expDes}>
            <section className={styles.jobDes}>
              <ul>
                <li>参与 K12 阶段多媒体课件的媒体呈现理论研究，研究聚焦不同年龄段学生适合通过通过哪些类型的多媒体传递教学内容，撰写研究报告。</li>
                <li>参与中国少年儿童出版社的小学导读课程培训项目，撰写小学课外阅读指导课教师培训方案。</li>
              </ul>
            </section>
          </div>
        </section>

      </CollapseContent>

      <CollapseContent title='教育经历'>
        <section className={styles.expContainer}>
          <header className={styles.expHeaderWithFlex}>
            <div>
              <JobTitle>教育技术学 硕士</JobTitle>
              <CompanyName>江南大学 | 2014年9月-2017年6月 | 无锡</CompanyName>
            </div>
            <Image
              src="/images/jiangnan_university_logo.png" alt="jiangnan_university_logo"
              width={75}
              height={75}
            />
          </header>
          <div className={styles.expDesEdu}>
            <p><strong>
              发表中文核心期刊：
            </strong>
            </p>
            <ul>
              <li>
                <a href="https://www.cnki.com.cn/Article/CJFDTOTAL-DHJY201702003.htm">
                  《走在十字路口的教育技术研究——教育技术研究的反思与转型》（电化教育研究.2017）
                </a>
              </li>
              <li>
                <a href="https://www.cnki.com.cn/Article/CJFDTotal-HIGH201612010.htm">
                  《信息化进程中教育研究范式的转型》（高等教育研究.2016）
                </a>
              </li>
            </ul>

            <p><strong>硕士学位论文：</strong></p>
            <ul>
              <li className={styles.thesis}>
                <a href="https://cdmd.cnki.com.cn/Article/CDMD-10295-1017250327.htm">
                  《信息化环境下理解性教学设计研究》
                </a>
              </li>
            </ul>

          </div>
        </section>

        <section className={styles.expContainer}>
          <header className={styles.expHeaderWithFlex}>
            <div>
              <JobTitle>教育技术学 学士</JobTitle>
              <CompanyName>江南大学 | 2010年9月-2014年6月 | 无锡</CompanyName>
            </div>
            <Image
              src="/images/jiangnan_university_logo.png" alt="jiangnan_university_logo"
              width={75}
              height={75}
            />
          </header>


        </section>
      </CollapseContent>

    </main >
  );
};

export default Cv;