
import styles from './pageContent.module.scss';

import { TPost } from "../../../models/posts";

type DetailPropsType = {
  detail: TPost
};

export default function DetailPageContent({detail}: DetailPropsType) {
  return (
    <main className={styles.container}>
      <div className={styles.date}>{detail.date}</div>
      <div dangerouslySetInnerHTML={{ __html: detail.htmlContent as string }} />
    </main>
  );
}