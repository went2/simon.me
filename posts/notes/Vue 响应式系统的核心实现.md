---
title: 'Vue3 响应式系统的核心实现'
date: '2022-12-13'
year: '2022'
abstract: '实现一个 mini-vue 框架的“响应性”部分，分步骤记录'
---

# Vue 响应式系统的核心实现

Vue 的作者曾在2020年的[一门课程](https://www.vuemastery.com/courses/vue3-deep-dive-with-evan-you/virtual-dom-and-render-functions)中简要介绍了 Vue 核心逻辑核心逻辑（渲染、响应式）的实现，本文介绍其“响应式”部分的实现，分几个阶段记录：

## 阶段一：用发布订阅模式实现基本的响应性

期望实现的效果：

  - 变量的值发生改变后，自动执行使用该变量的函数

变量是用户声明用来保存数据的标识符，又把变量叫做依赖（dependent），把用到变量的函数叫副作用（effect），又叫订阅者（subscriber）。

一个依赖内部要保存它的订阅者（effect），同时要有方法：在获取它的值时触发依赖收集，在它的值改变时，通知订阅函数。有一种通用模式来描述这个效果，叫 `EventEmitter`，所以我们用管理一个 `EventEmitter` 的这种方式管理变量，在 Vue 中，它的叫法不同，叫 `Dep`。

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

// Dep 可以保存副作用了，现在要有地方来读取这个对象的值，也就是就是触发副作用。
// 开发中，effect 就是模板中读取变量值的地方 <div>{{ mgs1 }}</div>
// 只要读取对象的值，就触发依赖收集，将当前的 effect 设为 activeEffect
// activeEffect 是全局变量

let activeEffect;
activeEffect = function () {
  console.log(`rendering ${ msg1.value }.`);
}

activeEffect(); // 调用一次以触发依赖收集：打印 rendering 1111

msg1.value = '2222'; // 自动打印 rendering 2222
msg1.value = '3333'; // 自动打印 rendering 3333，效果实现
```

## 阶段二：定义 watchEffect 自动设置 activeEffect

引入 `watchEffect()`，只要开发者调用 watchEffect, 传入自定义的 effect，就会将它设为activeEffect，并调用一次以触发依赖收集。

```js
function watchEffect(effect) {
  activeEffect = effect;
  effect();
  activeEffect = null;
}

watchEffect(() => {
  console.log(`rendering again ${ msg1.value }`);
});

msg1.value = '4444'; // 自动打印 rendering againg 4444，效果实现
```

## 阶段三：使一个普通对象具有响应性

上面实现了一个基本值（primitive）的响应性，借助一个类似 `EventEmitter` 的结构（Dep），使得每次设置值的时候都触发副作用。现在要为一个普通对象设置响应性，也就是读取这些属性的值时，为这些属性保存它们的订阅者，修改属性值的时候，通知它们的订阅者。

实现思路和上面一样，对象的每个属性都要有需要一个 Dep 对象来拦截属性的访问和赋值。如何监听对象属性的读取？
  - Vue2：Object.defineProperty，存取描述符（accessor descriptor），重新定义对象的属性。在属性的 get() 中收集依赖，在 set() 中通知相关的 effect 进行执行。
  - Vue3：为每个对象创建代理对象 Proxy，监听对代理对象的读写操作。

用什么数据结构保存这些的关系？

Vue3 用了一个 WeakMap 全局对象保存所有的响应式对象：
  - key 是响应式对象；
  - value 是一个 Map 对象，这个 Map 对象保存了响应式对象的属性和订阅的 effects。

```js
const targetMap = new WeakMap();
function getDep(target, key) {
  // 根据 target 对象取出它的 depsMap 对象
  let depsMap = targetMap.get(target);
  if(!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  // 获取具体的 dep 对象
  let dep = depsMap.get(key);
  if(!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}

// 为原始对象设置响应性
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

const info = reactive({ name: 'james', age: 20 });
const style = reactive({ color: 'red', margin: '12px' });

watchEffect(() => {
  console.log(`effect3333 ${ info.name }`)
})

info.name = 'tommy'; // 显示：effect3333 tommy，实现成功
```

## 阶段四：用 Proxy 实现 reactive()，其他不变

```js
function reactive3(raw) {
  return new Proxy(raw, {
    get(target, key, receiver) {
      const dep = getDep(target, key);
      dep.depend();
      return Reflect(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const dep = getDep(target, key);
      const result = Reflect.set(target, key, value, receiver);
      dep.notify();
      return result;
    }
  });
}
```