---
title: 'Vue 响应式系统的核心实现'
date: '2022-12-13'
year: '2022'
abstract: '回顾了实现一个 mini-vue 课程中的 reactivity 实现过程，分步骤记录'
---

# Vue 响应式系统的核心实现

[Evan You 有一个课程](https://www.vuemastery.com/courses/vue3-deep-dive-with-evan-you/virtual-dom-and-render-functions)讲解 Vue 的核心逻辑（渲染、响应式）的实现，今天回顾了一下响应式部分的实现，用几个阶段记录其过程：

## 阶段一：用发布订阅模式实现基本的响应性

期望实现以下效果：

- 变量 msg 值发生改变后，会自动执行用到该变量的函数

变量 msg 就叫依赖（dependent），一个依赖的内部要保存它的订阅者（effect），同时要有方法：在获取它的值时触发依赖收集，在它的值改变时，通知订阅函数。

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

let activeEffect;

activeEffect = function () {
  console.log(`rendering ${ msg1.value }.`);
}

activeEffect(); // 手动调用一次以触发依赖收集：打印 rendering 1111

msg1.value = '2222'; // 自动打印 rendering 2222
msg1.value = '3333'; // 自动打印 rendering 3333，效果实现
```

## 阶段二：定义 watchEffect 自动设置 activeEffect

定义 `watchEffect()`，只要开发者调用 watchEffect, 传入自定义的 effect，就会将它设为activeEffect，并调用一次以触发依赖收集。

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

## 阶段三：使普通对象的 key 都具有响应性

上面实现了一个普通变量的响应性，用到一个 dep 对象来管理变量的值、实现订阅、通知等方法；现在需要让一个普通对象的 key 也有这样的响应性。

需要有一个数据结构存一种映射关系：
  - key 是需要响应性的对象，类型是对象；
  - value 是这个对象的 key 的 dep 对象，类型是 Map

这有点绕，实际过程仍然是，需要一个 dep 对象来实现一个属性（变量）的响应性。一个普通对象有多少属性，就需要多少个 dep 对象来实现。对于一个变量，可以用类实现对它的读取操作的监听；对于一个对象，如何监听其属性的读取？
  - vue2：为对象的每个 key 执行 Object.defineProperty，使用存取描述符，监听对象属性的读写，读一个属性时，收集依赖，改变属性值时，进行通知。
  - vue3：为每个对象创建代理对象 Proxy，监听对代理对象的读写操作。

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

// 劫持 raw object 
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