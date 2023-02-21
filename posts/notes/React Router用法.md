---
title: "React Router 6 用法"
date: "2022-12-08"
year: "2022"
abstract: "记录 React Router 6 的用法"
---

# React Router 6 用法

本文提到的路由指`前端路由`，指地址栏的 URL 改变后，浏览器不会拿当前的地址向服务器发起请求，而由 JavaScript 处理 url 的变化，异步获取数据，并更新局部页面。

浏览器端实现 url 变化而不刷新页面的方式有两种：

  - 改变 url 的 hash 字段
  - 使用 History Api

路由的核心是一张映射表，保存路径与对应组件的映射，写路由就是配置这种映射关系，然后在页面放上放上匹配到的组件的出口(outlet)。

React Router 是在 React 项目中实现前端路由的组件库，由社区维护，目前（2022.12）更新到 v6.4，web 项目使用其中的 `react-router-dom` 包，简要记录其用法：

1. 开启路由：`<App />` 组件外包裹 `<HashRouter>` 或 `<BrowserRouter>`
2. 配置路由：`<Routes>` 组件中嵌套 `<Route>` 组件, 一个 `<Route>`表示一条配置信息，`<Route path="/home" element={<Home />} />`
3. 重定向：使用 `<Navigate to="/path" />`
4. 路由嵌套：`<Route>` 中嵌套 `<Route>` 组件
5. 手动切换路由
6. 通过路由传递数据
  - 动态路由
  - 通过 query string
7. 封装高阶组件以在类组件中使用 hooks
8. 将路由配置写成对象，通过 `useRoutes` 使用
9. 路由懒加载，`React.lazy()`，一般和 `<Suspense>` 一起用

[代码仓库](https://github.com/went2/react-router-demo)，及说明：

## 2. 配置路由， 8. 将配置写成对象

见 `./src/router/index.js`

## 5. 手动切换路由 6. 通过路由传数据 7. 封装高阶组件

是对 react-router-dom 提供的 `useNavigate`、 `useParams`、 `useSearchParams`的使用，在函数式组件中导入直接使用，在类组件中需要通过高阶组件做增强。以下是一个增强路由功能的高阶组件。

```js
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function withRouter(OriginComponent) {
  return function (props) {
    const navigate = useNavigate();
    const params = useParams();
    const [searchParams] = useSearchParams();
    const query = Object.entries(searchParams);

    const router = {
      navigate,
      params,
      query,
    };

    return <OriginComponent {...props} router={router} />;
  };
}
```

## 9. 路由懒加载示例

```js
const DiscoverRecommend = React.lazy(() =>
  import("../pages/Discover/DiscoverRecommend")
);
const DiscoverToplist = React.lazy(() =>
  import("../pages/Discover/DiscoverToplist")
);
```
