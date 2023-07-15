---
title: '漫谈面向对象的 JavaScript：创建对象和实现继承'
date: '2022-02-28'
year: '2022'
abstract: '面向对象是一种编程范式，编程语言实现支持面向对象开发的特性，程序员使用面向对象的思路进行开发。讨论 JavaScript 的面向对象，是说它如何在语言层面实现面向对象的特性。'
---

# 面向对象的 JavaScript：创建对象和实现继承

面向对象是一种编程范式，编程语言实现支持面向对象开发的特性，程序员使用面向对象的思路进行开发。

讲 JavaScript 的面向对象，是讲 JavaScript 如何在语言层面实现面向对象的特性：

- 封装(encapsulation): 把**数据**藏起来，只能通过提供的方法访问、更改数据，如为成员变量设置 `getter` 和 `setter`。
- 抽象(abstraction): 把**复杂性**藏起来，如把某个功能的实现过程全部隐藏，对外留一个干净的接口调用。
- 继承(inheritence): 重用代码。
- 多态(polymorphism): 一个父类的变量，可以调用相同接口的不同子类的实现。

## 1.实现的语言基础：原型与原型链

### 1.1 通过原型创建对象

![img](https://docs.microsoft.com/en-us/previous-versions/msdn10/images/ff852808.img007(en-us,msdn.10).png)

图：对象们各自管理自己的状态，但通过原型对象共享方法。

JS 中的每个对象有 `[[prototype]]` 属性，这个属性也是个对象，一般叫它对象的（隐式）原型，它在规范中是隐藏属性，供浏览器引擎内部使用。但浏览器一般提供 `__proto__` 属性访问这个对象。

由于对象的原型本身也是对象，也有 `[[prototype]]` 属性。

在访问对象的属性时，先查找自身的属性，如果没有，会去 `[[prototype]]` 属性上(`obj.__proto__`)找，如果没有，会继续到原型对象的 `[[prototype]]` 属性(`obj.__proto__.__proto__`)上找，一直会找到 `Object.prototype` 这个对象，再往下找，`Object.prototype.__proto__` 是 null，就到达了原型链的终点。

函数在 JS 中是对象，也有 `[[prototype]]` 属性，此外，函数对象额外有 `prototype` 属性（普通对象没有），这个属性是个对象，它的作用发挥在创建实例时。prototype 对象上有 constructor 属性，指回该函数，即`fun1.prototype.constructor === fun1`。

`const person = new Person()` 时发生的事：

1. 创建一个新的对象 obj，将它作为 Person 函数执行上下文中的 this。
2. 将新对象的 `[[prototype]]` 属性指向 `Person.prototype` 对象，此时 `obj.__proto__ = Person.prototype`。
3. 执行 Person 函数的函数体。
4. 返回 obj。

### 1.2 基于原型链实现继承

在讨论基于原型链实现继承时，后面用**对象的隐式原型**指 `[[prototype]]` 属性指向的对象，用**函数的显式原型**，指它的 `prototype` 属性指向的对象。

- 对于普通对象来说，我们关心它的隐式原型，从它可以访问到构造该对象的构造函数，以及公共方法。且普通对象没有 `prototype` 属性。
- 对于构造函数来说，我们关心它的显式原型，因为从构造函数创建对象的重要过程就是把它的显示原型复制给实例。

原型链实现继承的关键步骤是，要有一个中间对象，这个对象的隐式原型指向父类的 `prototype` 属性（即它是一个父类的实例），并且使子类的显式原型指向这个中间对象，构建起这样一个关系：

`ChildClass.prototype = superInstance.__proto__ = Super.prototype`

## 2. ES6 中的类语法

ES6 的 class 声明类的写法是一种语法糖，类以及类继承的实现仍是借助原型链。

### 类的声明：实例方法、类方法、extends

```js 
class Person {
  constructor(age, name="anonymous") {
    this._name = name;
    this.age = age;
  }

  // 实例方法
  eating() {
    console.log('eating...');
  }

  // 类的访问器方法
  get name() {
    return this._name;
  }

  // 类的静态方法，由类调用，内部的 this 指向类自身
  static randomPerson() {
    return new this(Math.floor(Math.random() * 100));
  }

}

class Student extends Person {
  constructor(name, age, sno, score) {
    super(name, age);
    this.sno = sno;
    this.score = score;
  }

  studying() {
    console.log('studying...')
  }
}
```

## 3. JS 中的多态

[多态的定义](https://zh.wikipedia.org/wiki/%E5%A4%9A%E6%80%81_(%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6)): 多态（polymorphism）指为不同数据类型的实体提供统一的接口，或使用一个单一的符号来表示多个不同的类型。

按照这种定义，JS 到处有多态：

```js

// 同一个接口sum
function sum(a, b) {
  return a + b;
}

// 传入不同的数据类型，实现不同功能：加法与字符串连接
sum(10, 20);
sum('rgb', '000');
```

## 4. 参考

- [酷壳: 如此理解面向对象编程](http://coolshell.cn/articles/6441.html)

- [酷壳: 再谈javascript面向对象编程](http://coolshell.cn/articles/6668.html)

- [Scott Allen: Prototypes and Inheritance in JavaScript](https://docs.microsoft.com/en-us/previous-versions/msdn10/ff852808(v=msdn.10))
