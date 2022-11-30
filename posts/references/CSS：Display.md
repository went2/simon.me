---
title: 'CSS：Display module'
date: '2022-10-11'
year: '2022'

abstract: 'CSS3 Display module 标准中的相关概念理解'
---

# Display module

模块标准: [CSS Display Module Level 3](https://drafts.csswg.org/css-display-3)

Display 模块规定 CSS 如何从文档中的元素树中格式化盒子树(box tree)，并定义用于控制它的 `display` 属性。

## 前置知识：创建盒子

CSS 的功能是接过组织成元素树（tree of elements）的源文件，把它渲染到一个画布(canvas)上，画布可以是电脑屏幕或一张纸。CSS 最常用来渲染 DOM，根据元素树，CSS 会创建对应的盒子树作为中间结构，来代表最终渲染文档的格式化结构(formatting structure)。盒子树中的每个盒子，表示对应元素在画布中占据的位置，每个 `text run` 表示对应文本节点的内容。

为了创建盒子树，CSS 会：

- 1. 通过[层叠与继承规则](https://www.w3.org/TR/css-cascade/)（由层叠与继承模块定义），为源文档中每个元素和文本节点算出每个 CSS 属性的计算值；
- 2. 根据元素的 `display` 属性，为每个元素创建盒子，可能创建 1 个或多个，也可能创建 0 。通常情况，每个元素创建 1 个盒子，叫 `principal box`，表示元素本身和它的内容。盒子的类型由`display` 属性值决定，设定 `display：block` 的元素生成一个块盒子（block box）。
  - 元素创建多个盒子的情况：`display：list-item`，会创建一个 principal box 和一个子盒子叫 `marker box`
  - 元素不创建盒子的情况： `display：none`

## [Normal Flow](https://www.w3.org/TR/CSS22/visuren.html#normal-flow)

处于标准流中的盒子属于一个格式化上下文，CSS 2.2 中的格式化上下文有三种：table、block 和 inline。

- 块级盒子参与块级格式化上下文
- 行内级盒子参与行内格式化上下文

## 块容器

一个块容器要么包含块级盒子，要么包含行内级盒子。块级盒子参与块级格式化上下文，行内级盒子参与行内格式化上下文。

一个块级盒子是一个块容器，反过来不一定。

## Formatting Context 格式化上下文

格式化上下文是个排布盒子的**环境**，不同的 FC 根据不同规则 layout 里面的盒子。

## Block Formatting Context 块级格式化上下文

创建：浮动元素、绝对定位元素、非块盒子的块容器（inline-blocks, table-cells 等）、有`overflow`的块盒子，为其内容创建新的块级格式化上下文。

排布规则：

- 盒子从上到下一次排布，相邻盒子之间的垂直间距由 margin 决定。相邻块级盒子的垂直方向的 margin 会折叠。
- 每个盒子的左边会接触包含块的左边界，除非盒子自身也建立一个新的块级格式化上下文
