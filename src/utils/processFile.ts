import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkCollapse from "./remarkCollapse";
import remarkGfm from "remark-gfm";

import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

import { TPostFileData } from "../models/posts";

export async function getFileContentByName(dirName: string, fileName: string) {
  // 获取目录下的所有文件信息
  const docsDir = path.join(process.cwd(), dirName);
  const allDocsFiles = getFilesFromLocal(docsDir);

  // 根据文件名找到绝对路径
  const filePath = allDocsFiles.find((file) => file.title === fileName)!.path;
  const mdContent = fs.readFileSync(filePath, "utf8");

  // 使用 matter 解析 md string
  const matterResult = matter(mdContent);

  // 生成 html
  const htmlContent = await generateHtmlFromMd(matterResult.content);

  return {
    htmlContent,
    ...matterResult.data,
  };
}

export async function generateHtmlFromMd(mdContent: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkStringify)
    .use(remarkCollapse, {
      test: (_: string, node: any) => node.depth === 2,
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(mdContent);
  const html = file.toString();
  return html;
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
      if (info.isDirectory()) {
        _readDir(location, fileName);
      } else {
        result.push({
          category,
          title: fileName.replace(/\.md$/, ""),
          path: location,
        });
      }
    });
  };

  _readDir(entry);

  return result;
}
