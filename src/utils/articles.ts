/**
 * 处理 articles 的 pre-rendering
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const articleDir = path.join(process.cwd(), 'posts');

export type IArticle = {
  id: string;
  title: string;
  abstract: string;
  date: string;
  htmlContent?: string
}

export function getSortedArticleList() {
  const fileNames = fs.readdirSync(articleDir);

  const articleData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');

    const filePath = path.join(articleDir, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const matterResult = matter(fileContent);

    return {
      id,
      ...matterResult.data
    } as IArticle
  });

  // Sort articles by date
  return articleData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export function getArticleIds() {
  const fileNames = fs.readdirSync(articleDir);
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getArticleDetail(id: string) {
  const filePath = path.join(articleDir, `${id}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const matterResult = matter(fileContent);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  
  const htmlContent = processedContent.toString();

  return {
    id,
    htmlContent,
    ...matterResult.data
  } as IArticle
}