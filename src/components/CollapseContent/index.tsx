import { useState } from 'react';
import styles from './CollapseContent.module.scss';

interface PropsType {
  title: string;
  collapsed?: boolean;
  children?: React.ReactNode;
}

const CollapseContent = ({ title, collapsed = false, children }: PropsType): JSX.Element => {
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