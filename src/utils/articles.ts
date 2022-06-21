/**
 * 处理 articles 的 pre-rendering
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articleDir = path.join(process.cwd(), 'articles');

export interface IArticle {
  id: string;
  title: string;
  abstract: string;
  date: string;
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