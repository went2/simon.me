---
title: 'CSS的视觉格式化模型'
date: '2022-10-113'
year: '2022'

abstract: 'CSS 的视觉格式化模型概念'
---

# 视觉格式化模型

[视觉格式化模型官方标准](https://drafts.csswg.org/css2/#visudet)

## containing block 包含块

术语出处：

- [css2.2 - definition of "containing block"](https://www.w3.org/TR/CSS22/visudet.html#containing-block-details)
- [css positioned layout module level3 - 2.1 containing of blocks of positioned boxes](https://drafts.csswg.org/css-position-3/#def-cb)

包含块是个矩形，它内部的盒子根据一定规则进行定位。标准中提到包含块的时，主语都是盒子，说盒子的包含块，盒子建立包含块等。

- “盒子的包含块”，是指这个盒子**所处**的包含块；
- “盒子建立包含块”，指这个盒子为它的后代盒子建立包含块，包含块的区域就是这个盒子的街边（edges），盒子的边界分为盒子的内容区边界、内边距区域边界、边框区边界和外边距区域边界。

可以理解为，一个盒子的内容区(content area)、内边距、边框区、外边距**构成的矩形**都可能为其后代盒子建立包含块，至于是哪种矩形，取决于内部盒子的 position 属性。

从盒子的角度看：

- 根元素形成的盒子位于起始包含块（initial containing block）内——对于屏幕来说——就是 viewport 所在的区域。
- 除了根元素，如果一个元素的 position 是 relative 或 static，它的包含块由最近的祖先盒子的内容区决定。这个祖先盒子需是一个`块容器`(`block container`)或它创建了一个格式化上下文。
- 如果元素的 `position: fixed`， css2.2 的表述：它的包含块是 viewport。css3 的表述：它的包含块由一个最近的创建了“固定定位包含块”（`fixed positioning containing block`）祖先盒子创建（transform, will-change, contain 这些属性会让盒子创建固定定位包含块），找不到的话，就是 viewport。
- 如果元素的 `position: absolute`
  - css2.2 的表述：它的包含块由最近的 position 是 `absolute`，`fixed`，`relative` 的祖先盒子创建，如果祖先盒子是非行内元素，包含块就是祖先盒子的内边界区域（padding edge），如果是行内元素，包含块是一个包围了 该行内元素生成的首尾行内盒子的内边距盒子 的区域。
  - css3 的表述：它的包含块由最近的创建了 绝对定位包含块 的祖先盒子创建（position, transform, will-change, contain 这些属性会让盒子创建绝对定位包含块）。如果祖先盒子是非行内元素，同 css2 的表述，如果是行内元素，包含块从祖先盒子的首个 `box fragment` 的 `block-start` 和 `inline-start` 的内容区边界算起，到最后一个 `box fragment` 的 `block-end` 和 `inline-end` 的内容区边界结束（这里的英文都是术语，待考）。找不到这样的组件，其包含块就是起始包含块。

## line-height

一行文字的基线与上一行的基线之间的距离，且刚好等于一行的高度。

`line-height` 其实是用于设置两行之间的 leading。如

```html
<p>
  a dog is crossing <strong>the street</strong>. That's Jerry!
</p>
```

上面的dom结构会产生 4 种类型的盒子：
  1. p 产生 containing box，包含其他box的box；
  2. inline box: 行内元素产生的盒子，`<strong>` 元素产生行内盒子，其他连续的文本产生匿名行内盒子；
  3. line box: 行盒子，一行是一个line box，行盒子总会包裹行内的所有盒子，设置line-height 设的是行盒子的高度。
  4. content area: 内容区，包围文字的区域，高度由 font-size 决定

`line-height` 作用与 line box 的公式：
  1. 计算 line-height 与 font-size 的差，确定leading，如 `line-height: 20px; font-size: 16px; `，得到 leading 为 4px，leading 控制行之间的距离；
  2. 算出 leading 的一半，2px；
  3. 将 leading 的一半分别加到 content area 的 top 和 bottom，得到行盒子的高度；

`line-height` 比 `font-size` 小怎么办？ 计算公式一样，leading 的值为负，half-leading 会向内折叠，两行文字会叠到一起。

一行的高度（或行盒子的高度）由行盒子中最高的 `inline-box` 高度决定，因为行盒子总会把一行的内容都包裹住。

参考资料：

[line-height ppt](https://www.slideshare.net/maxdesign/line-height)