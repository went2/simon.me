
import styles from './pageContent.module.scss';

import Link from 'next/link';
import Image from "next/image";

import type { IProjectInfo } from "../../models/projects";

type ProjectsPropsType = {
  projects: {
    items: IProjectInfo[];
    description: string;
  };
};

export default function Projects(props: ProjectsPropsType) {
  const { items, description } = props.projects;
  return (
    <main className={styles.container}>
      <div className={styles.mainDesc}>{description}</div>
      <div className={styles.itemsList}>
        {items.map((item) => (
          <section key={item.name} className={styles.sectionItem}>
            <h2>{item.name}</h2>
            <div className={styles.extraInfo}>
              <span className={styles.updateTime}>{item.updateAt}</span>
              {item.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <Link className={styles.item} href={item.url} target="_blank">
              <Image
                className={styles.image}
                src={item.cover}
                alt="{item.name}"
                width={180}
                height={180}
              />
            </Link>
            <div className={styles.desc}>{item.desc}</div>
          </section>
        ))}
      </div>
    </main>
  );
}
