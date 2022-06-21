---
title: 'JavaScript 如何通过原型创建对象及实现继承'
date: '2022-02-28'
abstract: '如题'
---

## JavaScript 如何通过原型创建对象及实现继承

要掌握好 JavaScript，首先一点是必须摒弃一些其他高级语言如 Java、C# 等类式面向对象思维的干扰，全面地从函数式语言的角度理解 JavaScript 原型式面向对象的特点。

在原型式面向对象语言中，除内建对象 (build-in object) 外，不允许全局对象、方法或者属性的存在，也没有静态概念。所有语言元素 (primitive) 必须依赖对象存在。

不要把 `__proto__` 属性与 `prototype` 属性搞混，每个 JS 对象都有 `__proto__` 属性，只有函数对象有 `prototype` 属性。
	 - JS 对象继承得到的属性和方法都在 `__proto__` 属性中。
	 - JS 函数对象的 `prototype` 属性定义了从该函数创建出的对象拥有的属性和方法。

### 通过原型创建对象

![img](https://docs.microsoft.com/en-us/previous-versions/msdn10/images/ff852808.img007(en-us,msdn.10).png)

图：对象们各自管理自己的状态，但通过原型对象共享方法。

比如我们想创建一个 JS 数组对象，可以怎么做？

```js
var obj1 = {}
obj1.__proto__ = Array.prototype
Array.call(obj1)

obj1.push(2)
obj1.push('33')
```
其实这就是 `obj1 = new Array()` 时发生的过程：
	1. 创建一个空对象 `obj1`
	2. 将 `obj1` 的原型对象指向 Array 的 `prototype` 属性
	3. 调用 Array 构造函数并将该函数的 `this` 设为 obj1

`new` 操作符的核心的步骤就是把新对象的 `__proto__` 属性设为构造函数的 prototype 属性，从而创建出类似该对象（如Array）的一个新对象。对象的 `__proto__` 属性决定了它属于哪类对象。
```js
var obj = {}
console.log(obj.__proto__ === Object.prototype) // obj 是一个 Object 对象

var fn = function(){}
console.log(fn.__proto__ === Function.prototype) // fn 是一个 Function 对象
```

**实现一个类似 Object.create() 方法**

JS 对象都是从已有的原型对象中创建出来，了解上述过程后可以实现一个 `Object.create()` 方法

```js
var object = function(oldObj){
  var F = function(){}
  F.prototype = oldObj
  
  return new F()
}

var base = {
  id: 'baseId',
  printId: function(){
    document.write(this.id)
  }
}

var obj1 = object(base)
obj1.printId()
```

### 通过原型实现继承

核心步骤是将子构造函数的 `prototype` 属性设为父构造函数的“实例”

```js
var People = function(name) {
  this.name = name
}

People.prototype.printName = function(){
  console.log(this.name)
  return this.name
}

var Student = function(name) {
  this.name = name
}

Student.prototype = new People()

var stu1 = new Student('Amanda')
stu1.printName()
```


### 参考

[酷壳: 如此理解面向对象编程](http://coolshell.cn/articles/6441.html)
[酷壳: 再谈javascript面向对象编程](http://coolshell.cn/articles/6668.html)
[Scott Allen: Prototypes and Inheritance in JavaScript](https://docs.microsoft.com/en-us/previous-versions/msdn10/ff852808(v=msdn.10))
[Douglas Crockford: Advanced JavaScript](https://www.youtube.com/watch?v=DwYPG6vreJg)
