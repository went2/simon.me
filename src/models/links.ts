import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

import { getFilesFromLocal } from '../utils/processFile';

const docsDir = path.join(process.cwd(), 'docs');
const allDocsFiles = getFilesFromLocal(docsDir);

export async function getFileInfoByName(name: string) {
  const filePath = allDocsFiles.find(file => file.title === name)!.path;
  const fileContent = fs.readFileSync(filePath, 'utf8');
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

