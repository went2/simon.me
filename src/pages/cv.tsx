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
      <CollapseContent title='工作经历'>
        <section className="experience">
          <header>
            <p><strong>前端开发工程师</strong></p>
            <p>上海胜者教育有限公司 | 在线学堂部</p>
            <p>2021年8月 – 2022年5月</p>
          </header>
          <div className='content'>
            <p>就职期间参与以下类型项目开发：</p>

            <section className='job-description'>
              <p><strong>1. 公司财务后台管理系统</strong></p>
              <p>概述：为公司的销售、财务、客服等人员提供订单管理、财务管理、教务管理等功能的后台管理系统，前后端分离，前端技术栈Vue2+TypeScript+AntDesign Vue UI库。</p>
              <p>我的角色：为中途接手项目，接手时该项目已搭好项目架构（权限管理、动态路由、业务组件封装等），了解基础架构后，我继续进行业务页面的开发，直至项目上线。</p>
            </section>

            <section className='job-description'>
              <p><strong>2.	H5 小游戏开发</strong></p>
              <p>概述：在平板上使用的 H5 小游戏，规模如7k7k的“翻牌小游戏”。使用 Egret 引擎，TypeScript 开发，build后打包为压缩包，在 App 端 webview 中调用。</p>
              <p>我的角色：与产品经理沟通需求，设计小游戏状态、资源、视图的管理，独立完成3个小游戏开发，期间对Egret 引擎Api、DragonBone 龙骨动画有较多使用。</p>
            </section>

            <section className='job-description'>
              <p><strong>3.	移动端 H5 应用开发</strong></p>
              <p>概述：业务上有需求要将 App 应用的部分模块要以 H5 方式重构，build 后打包为压缩包，通过 App 的 webview 呈现，使用Vue2+TypeScript+Vant UI库。</p>
              <p>我的角色：设计项目文件结构，做了一些基础封装（网络请求、业务组件等），在此基础上参与两个业务模块的开发、修改与上线。</p>
            </section>

          </div>
        </section>

        <section className='experience'>
          <header>
            <p><strong>教学设计师</strong></p>
            <p>上海乐好教育科技有限公司</p>
            <p>2018年3月 – 2021年6月</p>
          </header>
          <div className="content">
            <p>就职期间担任教学设计师，执行公司教师培训项目，后转向产品运营岗，为公司的教学评价app、培训管理后台的运营提供支持，工作内容包括：</p>

            <section className='job-description'>
              <p><strong>1.	培训项目管理</strong></p>
              <ul>
                <li>参与学校培训需求沟通，参与撰写培训方案、制作预算，推进培训合同签订</li>
                <li>按排培训计划，策划主持项目启动会</li>
                <li>按计划执行每次培训活动，撰写新闻稿、月报、学期小结，发布到公司新闻平台，同时反馈给学校。</li>
              </ul>
            </section>

            <section className='job-description'>
              <p><strong>2.	教学设计与开发(K12班会课程)</strong></p>
              <ul>
                <li>前期策划与专家沟通：参与规划课程的整体目标与课时主题；制作课程开发预算与开发进度计划；与内容专家沟通确定开发规范与样例；建立项目管理文档，分配开发工作。</li>
                <li>内容开发：根据课程样例，开发各个课时的课程内容，积极征询专家意见以保证内容的质量。</li>
                <li>打包与发布：撰写课程产品说明文档，将工作内容包装成可供教师直接使用的形式。</li>
                <li>使用与反馈：课程试用阶段教师的反馈意见，着手第二版开发规划。</li>
              </ul>
            </section>

            <section className='job-description'>
              <p><strong>3.	媒体运营</strong></p>
              <ul>
                <li>微信公众号运营：撰写公司微信公众号运营规范文档；计划公众号的栏目设置、内容来源、推送频率；文案采编与推送；阅读数统计分析。</li>
                <li>公司官网、App运营：参与等账号开设、使用培训、使用问答、平台资源管理等基础运营及客服支持工作。</li>
              </ul>
            </section>
          </div>
        </section>

        <section className="experience">
          <header>
            <p><strong>教学设计师</strong></p>
            <p>上海思创网络科技有限公司 | 课程运营部</p>
            <p>2017年7月 – 2018年2月</p>
          </header>
          <div className="content">
            <p>就职期间担任教学设计师，工作内容包括：</p>
            <ul>
              <li>售前方案支持：根据公司的业务项目，为客户定制员工培训方案，与市场部同事协同，促进订单签订。</li>
              <li>企业培训微课脚本设计：根据客户需求，萃取培训文本内容，设计微课脚本，与Flash开发人员合作，完成微课成品。</li>
              <li>移动学习平台基础运营：参与企业微信公众号服务平台的功能测试、平台部署等工作。</li>
            </ul>
          </div>
        </section>

        <section className="experience">
          <header>
            <p><strong>教学设计师（实习）</strong></p>
            <p>无锡睿泰科技有限公司 | 课程研发部</p>
            <p>2016年7月 – 2016年9月</p>
          </header>
          <div className="content">
            <ul>
              <li>参与 K12 阶段多媒体课件的媒体呈现理论研究，研究聚焦不同年龄段学生适合通过通过哪些类型的多媒体传递教学内容，撰写研究报告。</li>
              <li>参与中国少年儿童出版社的小学导读课程培训项目，撰写小学课外阅读指导课教师培训方案。</li>
            </ul>
          </div>
        </section>

      </CollapseContent>

      <CollapseContent title='教育经历'>
        <section>
          <p>教育技术学 硕士</p>
          <p>江南大学 | 2014年9月-2017年6月 | 无锡</p>
          <p>发表C刊：</p>
          <ul>
            《走在十字路口的教育技术研究——教育技术研究的反思与转型》（电化教育研究.2017-02-01）
          </ul>
          <ul>
            《信息化进程中教育研究范式的转型》（高等教育研究.2016-12-31）
          </ul>
          <p>硕士学位论文</p>
          <p>《信息化环境下理解性教学设计研究》</p>

        </section>
        <section>
          <p>教育技术学 学士</p>
          <p>江南大学 | 2010年9月-2014年6月 | 无锡</p>
        </section>
      </CollapseContent>

    </main >
  );
};

export default Cv;