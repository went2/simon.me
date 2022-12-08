import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

import { TPostFileData } from '../models/posts';

export async function getFileInfoByName(dirName: string, fileName: string) {
  // 获取目录下的所有文件信息
  const docsDir = path.join(process.cwd(), dirName);
  const allDocsFiles = getFilesFromLocal(docsDir);

  // 根据文件名找到绝对路径
  const filePath = allDocsFiles.find(file => file.title === fileName)!.path;
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // 读取html
  const matterResult = matter(fileContent);

  const processedContent = await remark()
  .use(html)
  .process(matterResult.content)

  const htmlContent = processedContent.toString();

  return {
    htmlContent,
    ...matterResult.data
  }
  
}

/**
 * 遍历嵌套的目录，返回一个包含文件信息的扁平的数组
 * @param entry 目录的绝对路径
 * @returns 
 */
export function getFilesFromLocal(entry: string): TPostFileData[] {
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
          title: fileName.replace(/\.md$/, ''),
          path: location
        });
      }
    });
  }

  _readDir(entry);
  
  return result;
}