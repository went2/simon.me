import fs from 'fs';
import path from 'path';
import { TPostFileData } from '../models/posts';

// 返回一个扁平的数组
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