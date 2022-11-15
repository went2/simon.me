/**
 * model/store of posts
 * view 从这里获取文章数据，这里的数据(暂时)来源于本地文件
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postDir = path.join(process.cwd(), 'posts');

export type TPost = {
  id: string;
  title: string;
  abstract: string;
  date: string;
  category: string;
  htmlContent?: string
}

/**
 * 从本地/posts 文件夹中获取所有.md文件，组成数组
 * 约定: /posts 文件下只有一层文件夹
 */
export function getAllSortedPosts(): TPost[] {

  const filePaths = getFilesFromLocal(postDir);
  const articleData = filePaths.map((fileInfo) => {

    const fileContent = fs.readFileSync(fileInfo.path, 'utf8');
    const matterResult = matter(fileContent);

    return {
      id: fileInfo.title,
      category: fileInfo.category,
      ...matterResult.data
    } as TPost
  });

    // sort articles by date
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

// util functions
function getFilesFromLocal(entry: string): Array<{ 
  title: string,
  path: string,
  category?: string
 }> {
  const result: any = [];

  // 遍历文件夹. entry: 绝对路径
  const _readDir = (entry: string, category?: string) => {
    const fileNames = fs.readdirSync(entry);

    fileNames.forEach((fileName: string) => {
      const location = path.join(entry, fileName);
      const info = fs.statSync(location);
      if(info.isDirectory()) {
        _readDir(location, fileName);
      } else {
        result.push({
          category, 
          title: fileName,
          path: location
        });
      }
    });
  }

  _readDir(entry);

  console.log('model result', result);
  return result;
}