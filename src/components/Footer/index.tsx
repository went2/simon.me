import { NextPage } from "next";
import styles from "./Footer.module.scss";

const Footer: NextPage = () => {
  return (
    <footer className={styles.container}>
      <p>
        <i className="fa fa-copyright"></i>
        {'\u00A0'} Simon Fisher 2022. Theme from <a href="https://www.neilwithdata.com/">neilwithdata</a>
      </p>
    </footer>
  );
};

export default Footer;