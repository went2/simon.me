"use client"

// styles
import styles from './home.module.scss';

// components
import Link from 'next/link';
import type { TPost } from '../../../models/posts';

export default function Home(props: { sortedPosts?: { [key: string]: Array<TPost> } }) {
  const posts = props.sortedPosts!;
  return (
    <main className={styles.container}>
      {
        Object.keys(posts).reverse().map(year =>(
          <section key={year} className={styles.section}>
            <div className={styles.sectionTitle}>{ year }</div>
            <div className={styles.sectionList}>
              {
                posts[year].map(post => (
                  <div key={post.id} className={styles.postItem}>
                    <h3>
                      <Link href={`/post/${post.id}`} className={styles.postItemTitle}>
                        {post.title}
                      </Link>
                      <span className={styles.postDate}>{post.date}</span>
                    </h3>
                    <p className={styles.postDesc}>{post.abstract}</p>
                  </div>
                ))
              }
            </div>
          </section>
        ))
      }
    </main>
  );
}