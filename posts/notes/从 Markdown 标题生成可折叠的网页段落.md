---
title: "从 Markdown 标题生成可折叠的网页段落"
date: "2023-03-20"
year: "2023"
abstract: "修改 mdast-util-heading-range 库以实现需求的过程"
---

## 前言

在 web 上发布的长文章，要以最直接的方式呈现大纲，让读者快速判断他所需的信息在哪个部分。一可以在文章开头列出本文大纲；二可以借助网页侧边栏的目录实现导航；三可以让文章内容根据标题范围折叠，这个功能常见于各种文本编辑器中，本着自己的项目多造轮子原则，实现了网页文章的按标题范围折叠内容的功能。

这里记录实现的思路和核心代码。

## 思路与代码

### 思路

1. 网页折叠的实现方式，几种可选：
	1）Html 原生交互：Html提供了 `<details>`、`<summary>` 标签标记内容的从属关系，浏览器为它们实现了折叠的效果，最省力的做法；
	2）CSS 实现：使用隐藏的 input 框记录展开/折叠状态，内容部分根据输入框的状态显示或隐藏
	3）JavaScript 实现，事件监听、为内容区加减 CSS 类，或者直接操作 DOM。
	我采用第一种。
2. 从 Markdown 文本转为 HTML 文本过程中，识别出内容中的标题与段落范围，并插入 `<details>`、`<summary>` 元素，这里使用  和 `mdast-util-heading-range`

### 核心代码

记录调整 `mdast-util-heading-range` 库以支持所有标题范围识别的代码。

`remark-collapse` 库内部使用 `mdast-util-heading-range` 检测 markdown 文本中的标题范围。`mdast-util-heading-range` 默认只识别文本中的第一个匹配到的标题范围，也就是直接使用 `remark-collapse` 的话，传入一篇有多个二级标题(`##` 标识)的 markdown 文本，结果只是第一个二级标题有折叠效果，从使用的角度让我觉得迷惑。

于是将 `mdast-util-heading-range` 源代码复制到本地，改了改使它支持所有指定标题的范围识别。其核心是生成一个所有标题范围的结构，比如需要匹配二级标题，它首先会生成一个数组：

```js
[
	{ start: 2, end: 5 },
	{ start: 5, end: 10 }
	{ start: 10, end: 30 }
	{ start: 30, end: 80 }
	{ start: 80, end: 92 }
]
```

这个处理结果表示文本共有 5 个二级标题，第一次二级标题的起始位置是 `mast` 语法树中的索引为 2 的节点，末尾是索引 5 的节点，依次类推。

核心代码如下：

```js
// node 是文本树，node.children 指文本所有节点的集合
function headingRange(node: any, options: any, callback: any) {
  let test = options;
  let children = node.children;

	  // 长度为 2 的数组
  const stack: number[] = [];
  let nodesRanges = [];
  // Find the ranges
  while (++index < children.length) {
    child = children[index];
    if (child.type !== "heading") continue;

    // 判断是否是结束位置的 heading: 最近一个大于等于用户设定 depth 的 heading
    if (depth && child.depth <= depth && stack.length === 1) {
      end = index;
      const rangeInfo = createRangeInfo(stack.pop()!, end);
      nodesRanges.push(rangeInfo);
    }

    if (test(toString(child), child)) {
      if (!depth) depth = child.depth; // 保存用户指定的 depth
      stack.push(index); // 保存开始位置
    }
  }
	nodesRanges.push(createRangeInfo(stack.pop()!, children.length));

	nodesRanges = nodesRanges.map((nodeInfo) => ({
      ...nodeInfo,
      nodes: callback(
        children[nodeInfo.start],
        children.slice(nodeInfo.start + 1, nodeInfo.end),
        children[nodeInfo.end],
        {
          parent: node,
          start: start,
          end: children[end] ? end : null,
        }
      ).filter((node: any) => node !== undefined),
    }));

    let addedOffset;
    for (let i = 0; i < nodesRanges.length; i++) {
      const range = nodesRanges[i];
      const originOffset = range.end - range.start + 1;
      addedOffset = addedOffset || range.nodes.length - originOffset;

      splice.apply(children, [
        range.start + addedOffset * i,
        originOffset,
        ...(range.nodes as never[]),
      ]);
    }
}
```