// types
import type { NextPageWithLayout } from "./_app-back";
import type { ReactElement } from "react";

// styles
import styles from "../styles/Projects.module.scss";

// utils
import { GetStaticProps } from "next";
import { getProjectsInfo, IProjectInfo } from "../models/projects";

// components
import Header from "../components/CompactHeader";
import Layout from "../components/Layout";
import Link from "next/link";
import Image from "next/image";

export const getStaticProps: GetStaticProps = async () => {
  const projects = await getProjectsInfo();

  return {
    props: {
      projects,
    },
  };
};

const Projects: NextPageWithLayout = (props: {
  projects?: {
    items: IProjectInfo[];
    description: string;
  };
}) => {
  const { items, description } = props.projects!;

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
};

Projects.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Header />
      {page}
    </Layout>
  );
};

export default Projects;
