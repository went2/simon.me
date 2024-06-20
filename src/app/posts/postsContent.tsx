"use client"

// styles
import styles from './postsContent.module.scss';

// components
import Link from 'next/link';

import type { TPost } from '../../models/posts';

const categoryI18n: any =  {
  essays: '随笔',
  notes: '笔记',
  references: '参考',
  translations: '翻译',
  coffee: '烘咖啡'
}

type PropsType = {
  categoriedPosts?: { [key: string]: Array<TPost> }
}

export default function PostsContent(props: PropsType) {
  const posts =  props.categoriedPosts!;
  return (
    <div className={styles.container}>
      <main className={styles.list}>
        {
          Object.keys(posts).map(category => {
            return (
              <section key={category} className={styles.section}>
                <div id={category} className={styles.sectionTitle}>{ categoryI18n[category] }</div>
                <div className={styles.sectionList}>
                  {
                    posts[category].map(post => (
                      <h3 key={post.id}>
                        <Link href={`/post/${post.id}`} className={styles.postItemTitle}>
                          {post.title}
                        </Link>
                      </h3>
                    ))
                  }
                </div>
              </section>
            );
          })
        }
      </main>
    </div>
  );
}