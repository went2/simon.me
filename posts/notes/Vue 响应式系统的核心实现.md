---
title: 'reactivity-of-vue3'
date: '2022-12-13'
updatedAt: '2023-07-10'
year: '2022'
abstract: '实现一个 mini-vue 框架的“响应性”部分，分步骤记录'
---

# Vue 响应式系统的核心实现

Vue 的作者曾在 2020 年的[一门课程](https://www.vuemastery.com/courses/vue3-deep-dive-with-evan-you/virtual-dom-and-render-functions)中简要介绍了 Vue 核心逻辑核心逻辑（渲染、响应式）的实现，本文介绍其“响应式”部分的实现，介绍之前说明几个前提概念：

- 变量就是依赖：用户定义的保存数据的对象，在 `data()` 选项中定义，或 `reactive()` 等响应式 API 定义。Vue 将用户定义的变量叫做依赖（dependent）；
- 使用变量的地方就是副作用：使用变量的地方就是依赖对应的副作用（effect），副作用如 template 中的 `<div>{{ user.name }}</div>` 或计算属性。
- 副作用又叫订阅者（subscriber）。
- 一个变量内部会保存它的订阅者们，同时在变量本身发生变化时，通知所有的订阅者。这是一种发布/订阅模式，`EventEmitter` 就是这种模式的实现之一。

实现响应式过程是：
  1. 框架要了解用户在何处使用、修改变量：拦截变量的读取过程，在 JS 中除了基本值都是引用类型，引用类型的最终都可追溯到 Object，监控对象属性的读写是元编程范畴的实践。
  2. 框架要保存每个对象每个属性的依赖：用 `EventEmitter` 的方式保存，Vue 中叫 `Dep`；
  3. 要实现一个过程，在读取对象属性值的时候，记录对象属性及其副作用，在改变属性值的时候，执行对应的副作用。

下面分步骤代码示例：

## 阶段一：用发布订阅模式实现基本的响应性

期望实现的效果：变量的值发生改变后，自动执行用到该变量的函数。

用发布/订阅模式的实现它，一个 Dep 的实例管理一个变量和它的订阅者们，变量泛指一个基本值，或一个对象的属性，所以它的“粒度”是很小的。

Dep 的使用方式是：
  1）先为每个变量创建一个 Dep 实例；
  2）然后在使用变量的地方，触发 dep 对象的订阅方法；在修改变量值的地方，就调用 dep 的通知方法。

```js
class Dep {
  constructor(value) {
    this._value = value;
    this.subscribers = new Set();
  }

  get value() {
    this.depend();
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
    this.notify();
  }

  depend() {
    if(activeEffect){
      this.subscribers.add(activeEffect);
    }
  }

  notify() {
    this.subscribers.forEach(effect => effect());
  }
}

let msg1 = new Dep('1111');

// 使用 Dep 的地方是副作用（effect）用到了该变量
// 框架需要知道用到该变量的副作用是什么，用 activeEffect 全局变量保存它。
let activeEffect;
activeEffect = function () {
  console.log(`rendering ${ msg1.value }.`);
}

activeEffect(); // 调用一次以触发依赖收集：打印 rendering 1111

msg1.value = '2222'; // 打印 rendering 2222
msg1.value = '3333'; // 打印 rendering 3333，效果实现
```

## 阶段二：定义 watchEffect 自动设置 activeEffect

这步实现的是，框架暴露了 `watchEffect()` 接口，使用者调用它，传入回调函数作为副作用，框架就知道了当前的副作用，将它设为 activeEffect，并调用一次以触发依赖收集。

```js
let activeEffect;
function watchEffect(effect) {
  activeEffect = effect;
  effect();
  activeEffect = null;
}

watchEffect(() => {
  console.log(`rendering ${ msg1.value }`);
});

msg1.value = '4444'; // 打印 rendering 4444，效果实现
```

## 阶段三：使一个普通对象具有响应性

上面的 Dep 实现了一个基本值的响应性，现在要为一个普通对象设置响应性，即为每个对象的属性设置响应性，读取属性值，为这些属性保存它们的订阅者，修改属性值时，通知它们的订阅者。

所以把 Dep 中关于 _value 的存取独立实现为 `reactive()`，它接收一个对象，拦截对象的每个属性的读写操作，为它们创建对应的 Dep 实例，返回一个用户使用的响应式对象。如何监听对象属性的读取？
  - Vue2：`Object.defineProperty`，用存取描述符（accessor descriptor）重新定义对象的属性。在属性的 get() 中收集依赖，在 set() 中通知相关的 effect 进行执行。
  - Vue3：为每个对象创建代理对象 Proxy，监听对代理对象的读写操作。

除此以外，还要一个数据结构保存数据对象，和它所有属性的 Dep 对象的关系，当然数据对象不止一个。

Vue3 用了一个 WeakMap 全局对象保存所有的数据对象，其结构如：
  `WeakMap<Object, Map<String, Dep>>`：
    - WeakMap 的 key 是用户定义的数据对象；
    - 数据对象关联到一个 Map，保存对象所有属性订阅的副作用。

```js
// 拦截数据对象的读写属性操作
function reactive(raw) {
  Object.keys(raw).forEach(key => {
    const dep = getDep(raw, key);
    let value = raw[key];

    Object.defineProperty(raw, key, {
      get() {
        dep.depend();
        return value;
      },
      set(newValue) {
        if(value !== newValue) {
          value = newValue;
          dep.notify();
        }
      }
    })
  });
  return raw;
}

const targetMap = new WeakMap();
// getDep 返回的是数据对象的 Map<String, Dep>
// target 数据对象，key 对象的属性
function getDep(target, key) {
  let depsMap = targetMap.get(target);
  if(!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  // 获取属性的 dep 对象
  let dep = depsMap.get(key);
  if(!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}

// 使用
const info = reactive({ name: 'james', age: 20 });
const style = reactive({ color: 'red', margin: '12px' });

watchEffect(() => {
  console.log(`effect3333 ${ info.name }`)
});

info.name = 'tommy'; // 显示：effect3333 tommy，实现成功
```

## 阶段四：用 Proxy 实现 reactive()，其他不变

将对象的属性拦截用 Proxy API 实现，用 TS 做了简易类型设定，全部代码如下：

```ts
interface RawObj {
  [key: string | symbol]: any;
}
type EffectFunc = (...args: any[]) => void;

function reactive(raw: RawObj) {
  return new Proxy(raw, {
    get(target, key) {
      const dep = getDep(target, key);
      dep.depend();
      return target[key];
    },
    set(target, key, newValue) {
      const dep = getDep(target, key);
      const result = Reflect.set(target, key, newValue);
      dep.notify();
      return result;
    },
  });
}

class Dep {
  public subscribers: Set<EffectFunc>;
  constructor() {
    this.subscribers = new Set();
  }
  public depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
  }
  public notify() {
    this.subscribers.forEach((effect) => effect());
  }
}

// WeakMap<Object, Map<string, Dep>>
const targetMap = new WeakMap();
function getDep(target: RawObj, key: string | symbol) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}

// watchEffect API
let activeEffect: EffectFunc | null;
function watchEffect(effect: EffectFunc) {
  activeEffect = effect;
  effect();
  activeEffect = null;
}

// 使用
const user = reactive({ name: "james", gender: "male" });
const style = reactive({ color: "red", margin: "12px" });

watchEffect(() => {
  console.log(`user gender changed to ${user.gender}`);
});
watchEffect(() => {
  console.log(`style color changed to ${style.color}`);
});

user.gender = "female"; // 打印：user gender changed to female
style.color = "blue"; // 打印：style color changed to blue
```

将上述代码用 `ts-node` 测试可以得到预期结果。全部实现不到 100 行。

完。