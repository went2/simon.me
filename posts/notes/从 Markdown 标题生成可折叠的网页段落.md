---
title: "从标题生成可折叠的网页段落"
date: "2023-03-20"
year: "2023"
abstract: "修改 mdast-util-heading-range 库以实现需求的过程"
---

## 前言

发布到 Web 的文章，我希望一开始能呈现大纲，让观众先对全篇的话题范围有所把握，帮助判断他们需要的信息在哪部分。

本文介绍了一次自动从标题生成可折叠文章内容的实践。单就可折叠内容来说，HTML 提供的 `<details>` 与 `<summary>` 已具备内容折叠的能力，之所以有这次的实践，是因为网页的内容不来自直接编辑 HTML 文档，而是从 Markdown 文档编译而来，本文记录其中核心过程的实现：如何从 mast 语法树中识别标题及其内容的实践。

## 思路与代码

### 思路

1. 网页折叠的实现方式，几种可选：
	1）HTML 原生交互：HTML 提供了 `<details>`、`<summary>` 标签标记内容的从属关系，浏览器为它们实现了折叠的效果，最省力的做法；
	2）CSS 实现：使用隐藏的 input 框记录展开/折叠状态，内容部分根据输入框的状态显示或隐藏
	3）JavaScript 实现，事件监听、为内容区加减 CSS 类，或者直接修改相应 DOM。
	
  这里采用第一种原生语义化标签的方式。

2. 从 Markdown 文本转为 HTML 文本过程（）中，需要识别出内容中的标题与**段落范围**，并插入 `<details>`、`<summary>` 元素，识别 Markdown 标题范围用到了 `remark-collapse` 这个工具库。

### 核心代码

`remark-collapse` 并不完全满足我的要求，原因在于它内部使用了 `mdast-util-heading-range` 库检测 markdown 文本中的标题范围，而后者默认只识别文本中的第一个匹配到的标题范围，也就是直接使用 `remark-collapse` 的话，传入一篇有多个二级标题的 Markdown 文本，结果只会第一个二级标题有折叠效果。

我看了几遍 `mdast-util-heading-range` 源码，确认是这个效果，便觉得迷惑，想着改一下它的源码以支持识别一篇文章的所有标题范围。

将 `mdast-util-heading-range` 源代码复制到本地，看了看，改造的思路是生成一个所有标题范围的结构，比如需要匹配二级标题，首先生成一个数组：

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

完成上述修改后，在 `remark-collapse` 中引用自己修改的 `headingRange`， 就识别全篇文章的指定标题，进而做自定义操作，如插入 `<details>`、`<summary>` 元素等。