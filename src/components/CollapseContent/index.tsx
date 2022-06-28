import { NextPage } from 'next';
import { useState } from 'react';
import styles from './CollapseContent.module.scss';

interface PropsType {
  title: string;
  collapsed?: boolean;
  children?: React.ReactNode;
}

const CollapseContent: NextPage<PropsType> = ({ title, collapsed = false, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  return (
    <div className={styles.container}>
      <div
        className={`${styles.header} ${isCollapsed ? styles.showCollapsed : styles.showExpanded}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {title}
      </div>
      <div
        className={`${styles.collapseWrapper} ${isCollapsed ? styles.collapsed : styles.expanded}`}
      >
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default CollapseContent;