---
title: '面向对象的 JavaScript：创建对象和实现继承'
date: '2022-02-28'
year: '2022'
abstract: '面向对象是一种编程范式，编程语言实现支持面向对象开发的特性，程序员使用面向对象的思路进行开发。讨论 JavaScript 的面向对象，是说它如何在语言层面实现面向对象的特性。'
---

# 面向对象的 JavaScript：创建对象和实现继承

面向对象是一种编程范式，编程语言实现支持面向对象开发的特性，程序员使用面向对象的思路进行开发。

讲 JavaScript 的面向对象，是讲 JavaScript 如何在语言层面实现面向对象的特性：

- 封装(encapsulation): 把**数据**藏起来，只能通过提供的方法访问、更改数据，如为成员变量设置 `getter` 和 `setter`。
- 抽象(abstraction): 把**复杂性**藏起来，如把某个功能的实现过程全部隐藏，对外留一个干净的 interface 供调用。
- 继承(inheritence): 子类继承父类。
- 多态(polymorphism): 使用一个父类类型的指针，保存一个子类对象，并调用子类的方法，这时会先调用子类自己实现的同名方法，如果没有则调用父类的同名方法。

## 1.实现的语言基础：原型与原型链

### 1.1 通过原型创建对象

![img](https://docs.microsoft.com/en-us/previous-versions/msdn10/images/ff852808.img007(en-us,msdn.10).png)

图：对象们各自管理自己的状态，但通过原型对象共享方法。

JS 中的每个对象都有 [[prototype]] 属性，这个属性也是个对象，一般叫它对象的（隐式）原型，这个属性在规范中是隐藏属性，供浏览器引擎内部使用，不提供给发开发者使用。但浏览器提供 `__proto__` 来访问这个属性。

由于对象的原型本身也是对象，所以也有 [[prototype]] 属性。

在访问对象(obj)的属性时，先在对象自身查找该属性，如果没有，会去 [[prototype]] 属性上(`obj.__proto__`)找，如果没有，会继续到原型对象的[[prototype]]属性(`obj.__proto__.__proto__`)上找，直到原型链的终点null。

函数在 JS 中是对象，也有 [[prototype]] 属性，此外，函数对象额外有 `prototype` 属性（普通对象没有），这个属性是个对象，且是显性的，它的作用发挥在使用它创建实例时。prototype 对象上有name属性，指回该函数，即`fun1.prototype.name === fun1`。

`const person = new Person()` 时发生的关键事件：

1. 创建一个空对象obj，将它作为 Person 函数执行上下文中的this。
2. 将 Person 的 `prototype` 属性复制给空对象的[[prototype]]属性，此时 `obj.__proto__ === Person.prototype`，即 `obj.__proto__` 与 Person.prototype 指向同一个对象。
3. 执行Person函数的函数体。
4. 向外界返回返回obj。

### 1.2 基于原型链实现继承

ES5中，JavaScript 实现继承依托原型链实现，主要思路：将子类的[[prototype]]属性设为父类的`prototype`属性（或者说让子类成为父类的实例）

实现过程参考：

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 借用父类构造函数实现属性继承
function Student(name, age, sno, score) {
  Person.call(this, name, age); 
  this.sno = sno;
  this.score = score;
}

// 实现方法继承。这种方式叫寄生式继承 
function inherite(subClass, superClass) {
  subClass.prototype = Object.create(superClass);
  Object.defineProperty(subClass.prototype, "constructor", {
    enumerable: false,
    writable: true,
    value: subClass,
    configurable: true,
  });
}

inherite(Student, Person);

// Object.create的替代方法
function createObject(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

// Object.create(superClass) 的替代调用
createObject(superClass.prototype);

```

在讨论基于原型链实现继承时，必须时刻搞清楚正在讨论的是对象的[[prototype]]属性还是`prototype`属性：

- 对于构造函数来说，我们关心的是它的`prototype`属性（指向的对象），因为从构造函数创建的对象都和它的`prototype`属性有关；
- 对于一般对象来说，我们关心它的[[prototype]]属性（指向的对象），因为[[prototype]]属性决定了对象能够访问的不属于它自身（继承得到）的属性。

实现原型链继承过程的关键步骤是，要有一个中间对象，这个对象的[[prototype]]属性属性指向父类的`prototype`属性（不太准确地说，从父类创建出一个实例对象），并且使子类的`prototype`属性指向这个对象。

子类作为函数对象，除了`prototype`属性，自然也有[[prototype]]属性，但是谁关心呢？而子类的`prototype`属性是个普通对象，普通对象要关心它的[[prototype]]属性，因为从[[prototype]]属性能获取到继承到的属性以及它的父类是谁(.constructor)。

不过如果真的要关心构造函数的[[prototype]]属性的话，结论是：指向`Function.property`，Function、Object等构造函数的[[prototype]]属性都指向`Function.property`。

Object是所有对象的父类。因为构造函数`prototype`属性本身是对象，对象有[[prototype]]属性，这个属性在原型链上，沿着原型链向上找，找到的最后一个对象是`Object.prototype`。

## 2. ES6 中的类语法

JS中的用class声明类的写法是一种语法糖，类以及类继承的实现仍是借助原型链。

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

  // 类的静态方法，由类调用，内部的this指向类自身
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

按照这种定义，JS到处有多态：

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

- [Douglas Crockford: Advanced JavaScript](https://www.youtube.com/watch?v=DwYPG6vreJg)
