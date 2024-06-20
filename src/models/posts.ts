/**
 * store of posts，it runs on server-side
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { generateHtmlFromMd } from "../utils/processFile";
import { getFilesFromLocal } from "../utils/processFile";

export type TPost = {
  id: string;
  title: string;
  abstract: string;
  date: string;
  year: string;
  category: string;
  htmlContent?: string;
};

export type TPostFileData = {
  title: string;
  path: string;
  category?: string;
};

// 获取所有posts信息并缓存
const postDir = path.join(process.cwd(), "posts");
const allPostFiles: TPostFileData[] = getFilesFromLocal(postDir);

/**
 * 从本地 /posts 目录中获取所有.md文件，组成数组
 * 约定: /posts 文件下只有一层文件夹
 */
export function getAllSortedPosts(): Promise<TPost[]> {
  return new Promise((resovle, _) => {
    const postList = allPostFiles.map((fileInfo) => {
      const fileContent = fs.readFileSync(fileInfo.path, "utf8");
      const matterResult = matter(fileContent);
  
      return {
        id: fileInfo.title,
        category: fileInfo.category,
        ...matterResult.data,
      } as TPost;
    });
    // sort articles by descending order of date
    const sorted = postList.sort(({ date: a }, { date: b }) => {
      if (a < b) {
        return 1;
      } else if (a > b) {
        return -1;
      } else {
        return 0;
      }
    });
    resovle(sorted);
  });
}

export async function getPostInfoById(id: string) {
  console.log('===========', id);
  const filePath = allPostFiles.find((item) => item.title === id)!.path;

  const fileContent = fs.readFileSync(filePath, "utf8");

  const matterResult = matter(fileContent);

  const htmlContent = await generateHtmlFromMd(matterResult.content);

  return {
    id,
    htmlContent,
    ...matterResult.data,
  } as TPost;
}

export function getPostIds() {
  return allPostFiles.map((postFile) => {
    return {
      params: {
        id: postFile.title,
      },
    };
  });
}

export function getPostIdList() {
  let list = allPostFiles.map((postFile) => ({ id: postFile.title }));
  console.log('========= getPostIdList allPostFiles', allPostFiles, list)
  return allPostFiles.map((postFile) => ({ id: postFile.title }));
}
