---
title: 'Vue 响应式系统的核心实现'
date: '2022-12-13'
year: '2022'
abstract: '回顾了实现一个 mini-vue 课程中的 reactivity 实现过程，分步骤记录'
---

# Vue 响应式系统的核心实现

2020 年 Vue 的作者在[一门课程](https://www.vuemastery.com/courses/vue3-deep-dive-with-evan-you/virtual-dom-and-render-functions)中简要介绍了 Vue 核心逻辑核心逻辑（渲染、响应式）的实现，今天回顾了一下响应式部分的实现，用几个阶段记录其过程：

## 阶段一：用发布订阅模式实现基本的响应性

期望实现的效果：

  - 变量 msg 值发生改变后，自动执行使用该变量的函数

变量 msg 叫依赖（dependent），使用该变量的函数叫副作用（effect），或订阅者。一个依赖的内部要保存它的订阅者（effect），同时要有方法：在获取它的值时触发依赖收集，在它的值改变时，通知订阅函数。

- 变量只保存了一个值而已，怎么实现这些功能？
- 用一个对象包装这个变量，上述方法作为包装对象的方法来操作这个值，同时管理副作用。用类 Dep 来实现。

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

// 有了这个能订阅effect的对象后，要有地方来读取这个对象的值
// 就是 effect，实际开发中，effect 就是模板中读取变量值的地方 <div>{{ mgs1 }}</div>
// 只要读取对象的值，就触发依赖收集，将当前的 effect 设为 activeEffect
// activeEffect 是个全局变量
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

## 阶段三：使普通对象的 key 都具有响应性

上面实现了一个普通变量的响应性，用一个 dep 对象来管理变量的值、实现订阅、通知等方法；Vue 实现一个变量响应性的思路是拦截它的读取和赋值操作。现在要为一个普通对象的属性也设置响应性，即要先拦截这个对象所有属性的读取和赋值，我们说的拦截并不是指用户无法读取和改写对象或变量了，而是用户在读值或赋值的时候，Vue 能知道。

实现思路和上面一样，对象的每个属性都要有需要一个 dep 对象来拦截属性的访问和赋值。对于一个对象，如何监听其属性的读取？
  - vue2：借助 Object.defineProperty，用存取描述符，重新定义对象的属性。在对象属性的 get 方面中收集依赖，在 set() 方法中通知相关的 effect 进行执行。
  - vue3：为每个对象创建代理对象 Proxy，监听对代理对象的读写操作。

用什么数据结构保存这些的关系？

可以用一个 WeakMap 对象作为全局变量保存所有的响应式对象：
  - key 是响应式对象；
  - value 是一个 Map 对象，这个 Map 对象保存了响应式对象的属性和相关的 effects 的映射。

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