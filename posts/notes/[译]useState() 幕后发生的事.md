---
title: 'translations-useState() under the hood'
date: '2022-12-10'
year: '2022'
abstract: '谁帮组件记录并跟踪状态？'
---

# useState() 幕后发生的事

React v16.8 中实现 Hooks 以后，用函数写组件的方式渐成趋势，相比类组件，它的写法简明，写的时候心智负担也小。

简要说明开发者和 React 的分工：
  - 开发者：
    1. 定义函数式组件；
    2. 使用组件
  - React：
    1. 解析组件定义中的 jsx 语法（babel）；
    2. 递归调用 CreateElement 函数创建 React 元素，生成虚拟 DOM，从虚拟 DOM 创建真实 DOM 并挂载；
    3. 组件状态变化后，再次执行组件函数，创建新的 React 元素，通过 diff 后更新 DOM。

函数式组件是纯函数，纯函数一经写完，（输入相同时）无论调用多少次，都返回一样结果，且不会有副作用。因为函数返回后，函数对应的调用栈帧（stack frame）在调用栈中移除，函数作用域内声明的变量被垃圾回收。

如果在函数中初始化变量，在 jsx 中使用，每次 React 调用函数组件，里面的值都是初始值。

- React 提供 Hooks 让组件在多次渲染中保留它的状态
  - Hooks 是一类函数的统称。按官方说法，让我们能复用涉及状态的代码（reuse stateful logic）。"复用"是说 React 不必重复花费资源在跟踪某个状态的变化上。

- 为什么在函数式组件内调用 `useState()` 就能让组件记住状态？谁帮组件记录并跟踪状态？
  - 这个问题，早有好奇的[开发者提在 `stackoverflow` 上](https://stackoverflow.com/questions/53729917/react-hooks-whats-happening-under-the-hood)，以下对高赞答案作翻译，重点关注伪代码示例：

问：在重复渲染时，Hook 是怎么区分哪个是函数式组件的初始值，哪个是最新设置的值？

答：React 内部将组件状态保存到 [fiber](https://github.com/acdlite/react-fiber-architecture#what-is-a-fiber) 中。一个 fiber 是一个和组件实例关联的实体（内存中的一个对象）。这个“组件实例”是广义上的，函数式组件并不会真的创建实例对象。

React renderer（渲染器）能让 hook 访问相关的上下文、状态；又是 React renderer 调用组件函数，所以 React renderer 能把（组件函数内部调用的）hook 和该组件实例关联起来。

以下用伪代码表示 setState 的内部过程：

```js
let currentlyRenderedCompInstance;
const compStates = new Map(); // 保存组件实例和它的状态的映射
const compInstances = new Map(); // 保存组件函数和对应实例的映射

function useState(initialState) {
  // 设置初始值
  if (!compStates.has(currentlyRenderedCompInstance))
    compStates.set(currentlyRenderedCompInstance, initialState);

  return [
    compStates.get(currentlyRenderedCompInstance) // state
    val => compStates.set(currentlyRenderedCompInstance, val) // state setter
  ];
}

// React renderer，非组件本身的渲染函数
function render(comp, props) {
  const compInstanceToken = Symbol('Renderer token for ' + comp.name);

  if (!compInstances.has(comp))
    compInstances.set(comp, new Set());

  compInstances.get(comp).add(compInstanceToken);

  currentlyRenderedCompInstance = compInstanceToken;

  return {
    instance: compInstanceToken,
    children: comp(props)
  };
}
```

上面 `useState` 能根据实例的 token，获取当前渲染的组件实例，访问属于它的状态。其他内建的 hooks 也是照样为组件维护对应的状态。

（译注：代码的意思是说，React 内部有独立的数据结构来保存组件和它状态的对应关系。重复渲染时，组件函数重新执行，遇到 useState()，会根据当前渲染的组件的token，从数据结构中查它的状态，没有状态则设初始状态）

- 更深入了解可参考：
  - [Github React Fiber 架构解释](https://github.com/acdlite/react-fiber-architecture#what-is-a-fiber)：React 文档社区中的开发者的理解
  - [深入了解 React Hooks](https://www.callibrity.com/blog/deep-dive-into-react-hooks-and-complex-functional-components)：为什么 React Hook 不能在条件语句中调用？React 靠它确定每个组件对应的状态。