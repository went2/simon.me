/**
 * store of posts，这里相当于服务端
 * view 从这里获取文章数据，这里的数据(暂时)来源于本地文件
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

import { getFilesFromLocal } from '../utils/processFile';

export type TPost = {
  id: string;
  title: string;
  abstract: string;
  date: string;
  year: string;
  category: string;
  htmlContent?: string;
}

export type TPostFileData = {
  title: string;
  path: string;
  category?: string;
}

// 获取所有posts信息并缓存
const postDir = path.join(process.cwd(), 'posts');
const allPostFiles: TPostFileData[] = getFilesFromLocal(postDir);

/**
 * 从本地/posts 文件夹中获取所有.md文件，组成数组
 * 约定: /posts 文件下只有一层文件夹
 */
export function getAllSortedPosts(): TPost[] {

  const postList = allPostFiles.map(fileInfo => {
    const fileContent = fs.readFileSync(fileInfo.path, 'utf8');
    const matterResult = matter(fileContent);

    return {
      id: fileInfo.title,
      category: fileInfo.category,
      ...matterResult.data
    } as TPost
  });

    // sort articles by date
  return postList.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export async function getPostInfoById(id: string) {
  const filePath = allPostFiles.find(item => item.title === id)!.path;
  
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
  } as TPost
}

export function getPostIds() {
  return allPostFiles.map(postFile => {
    return {
      params: {
        id: postFile.title
      }
    }
  });
}