---
title: '一个网页项目的 MVC 实践'
date: '2022-11-27'
year: '2022'
abstract: '解释一个的查菜谱 demo 的前端 MVC 结构的实践'
---

# 一个网页项目的 MVC 实践

## 1.MVC 是什么

据[维基百科](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)，mvc 三者的发挥的作用分别是：

> Model: MVC的核心部分，是应用的动态数据结构，独立于用户界面。Model 直接管理应用的数据与逻辑。在web应用中数据库中的一张表结构就代表一个 model
>
> Controller: 接受输入，将其转化为对 model 或 view 的操作。
>
>   对于 WebObjects，由 views 处理用户输入，controller 充当 models 和 views 的桥梁，一整个应用可能只有一个 controller，大多数和业务相关的应用逻辑都在 controller 中。
>
>   Rails 会把客户端向服务器发起的请求发给一个 `router`（路由）， router 的作用是维护一个映射表，其中每个请求都对应一个 controller 中的某个方法，在方法内部读取请求数据以及与之相关 model 对象，然后生成一个 view 作为响应。每个 model 类型都会对应一个 controller，如一个 Client model 会有对应的 Clients controller 来处理。
>
>   Django 将发挥 controller 作用的对象叫做 `view`，一个 Django 中的 view 是一个函数，它接收网络请求，生成模板，返回响应。
>
> View: 任何一种信息的视觉化表示都叫 view，一个条形图、一张表格都是 view，相同的信息可以用不同的 view 来表示。
>
>   WebObjects 中的 view 是一个个完整的用户界面元素，如一个菜单、一个按钮，会从用户那里获取输入，view 是通用且可组合的(composable)。
>
>   Rails 和 Django 中的 view 是 HTML 模板，是浏览器显示的用户界面，而不是用户界面 widget，这种方式不要求 views 要规模小且可组合。

简言之：

- Model 管理应用程序中的数据，从 controller 中接收用户输入；
- View 是一种 model 的可视化表现；
- Controller 接收用户输入、验证，并改变对应 model 中的数据；

本项目是一个网页版查菜谱应用，实现了 “查询-> 显示可分页的列表 -> 点击列表显示详情” 基本功能，数据来自于网络api。MVC 三层都用 js 实现，写的时候大致把握一个原则，每一层不需要知道其他两层的具体细节，只调用它们对外暴露的方法，具体来说：

## 2.本项目的 MVC 实践

### 2.1 Model：`/src/js/model/index.js`

model 中有两个主要结构：state 和操作 state 的方法。这里用对象实现state，用函数实现方法。

model 定义应用的所有状态，及修改状态的方法，这里的状态指从 api 服务器中获取的业务相关的数据。model 只是定义要有这些状态、如何根据业务修改状态，自己不会主动创建、修改状态，而是等待 controller 的访问和修改。

举例：

```js
// 定义应用的状态
export const state = {
  recipe: {}, // 保存一份菜谱的详情数据
  search: { // 保存一次搜索的状态、分页数据以及当前页的列表数据
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  }
};

// 与业务相关的修改状态的方法
// 搜索功能：获取用户输入，ajsx请求，改变 model
export const getSearchResults = async function (query) {
  state.search.query = query;

  try {
    const data = await request(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(item => {
      return {
        id: item.id,
        title: item.title,
        publisher: item.publisher,
        image: item.image_url,
        ...(item.key && { key: item.key }),
      };
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};
```

一个 model 内部的结构大同小异，以下是另一个使用 Pinia 状态管理库设计的一个 model，重点也是两个：一个 state 和操作 state 的方法（actions）

```js
// src/store/modules/city.js
import { defineStore } from 'pinia';
import { getAllCities } from '@/service';

const useCityStore = defineStore('city', {
  state: () => ({
    allCities: {},
    currentCity: {
      cityName: '北京',
      cityId: 48,
    }
  }),
  getters: {},
  actions: {
    async fetchAllCitiesData() {
      const res = await getAllCities();
      this.allCities = res.data;
    }
  },
});

export default useCityStore;
```

### 2.2 Controller：`/src/js/controller.js`

实现两个功能：
  1. 处理页面交互，即用户点击按钮，要发生什么。绝大部分是事件处理函数，函数逻辑是：接收页面的输入 => 修改 model 中数据 => 通知相关 view 用最新的数据进行渲染；
  2. 初始化应用，为各个 view 绑定对应的事件处理函数

controller 对外只暴露 `init()` 方法，意思是初始化应用程序，`init()` 做的事是给 view 传入事件处理函数。

以用户在input框输入后点击提交的处理为例：

```js
// model
import * as model from './model';

// views
import searchView from './views/searchView';

// 响应搜索框的输入，获取数据渲染结果列表
const searchListController = async function() {
  resultView.renderSpinner();
  const query = searchView.getInput();
  if(!query) return;

  try {
    // 获取数据
    await model.getSearchResults(query);

    // 渲染相关的views
    resultView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch(err) {
    console.log(err);
    resultView.renderError(err);
  }
}

export default function init () {
  searchView.addEventHandler(searchListController);
}
```

*React 中怎么实现类似的效果？* 

React 中写的是组件，controller 中的内容也存在于组件中：

```jsx
import SearhInput from './components/SearhInput.jsx';
import Search from './components/Search.jsx';

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      query: '',
      result: []
    }
  }

  async getSearchResult() { 
    const result = await getSearchResultApi(query);
    this.setState({ result });
  }

  setQuery() {
    this.setState({ query });
    this.getSearchResult();
  }

  render() {
    return (
      <>
        {/* 给组件传回调相当于 controller init addEventListener */}
        <SearhInput setQuery={ query => this.setQuery(query) } />
        <SearchResult list={result} />
      </>
    )
  }
}

```

### 2.3 View：`/src/js/views/` 目录下的文件

view 层主要考虑两个问题：
  1. 如何生成可以绑定动态数据的模板，本项目用模板字符串实现；
  2. 如何通知 controller 层通知交互事件的发生。用户交互事件直接发生在 view 层，但处理事件的函数定义在controller 层，这里采用发布/订阅模式，controller 订阅 view 的事件（调用view的方法，传入回调），当事件发生时，view 会依次通知给所有订阅方（调用view传入的回调）。

这里的 view 用类来实现，对外导出这个类的实例，类似单例的用法。

以一个搜索框的实现为例：

```js
// in src/js/views/searchView.js
class SearchView {
  // 获取dom
  _parentElment = document.querySelector('.search');
  _searchFieldEl = document.querySelector('.search').querySelector('.search__field');

  // 对外暴露获取输入框的值的方法，什么时候调用由外界决定
  getInput() {
    const input = this._searchFieldEl.value;
    this._clearInput();
    return input;
  }

  // 清除表单输入框内容
  _clearInput() {
    this._searchFieldEl.value = '';
  }

  addEventHandler(handler) {
    this._parentElment.addEventListener('submit', function(e) {
      // 表单提交事件阻止默认行为，防止页面刷新
      e.preventDefault();
      handler();
    })
  }
}

export default new SearchView();
```

view 获取模板中的dom，向 controller 暴露操作 dom 的方法，其实叫它 ViewModel 更合适。

### 2.4 controller 和 view 如何通信——Observer 模式

[Observer 模式](https://en.wikipedia.org/wiki/Observer_pattern) 又叫发布/订阅模式，常用于处理事件驱动软件中处理随机发生的事件（HTTP requests, user input, distributed databases 等）。

观察者模式中，有两种角色，一种叫**subject**，会维护一份依赖列表，这些依赖叫**observers**，当subject 的状态发生改变时，会自动通知这些 observers，通知的方式通常是调用 observers 传入的方法。

以下词汇当作同义词使用：

1. subject：被观察者、发布者；
2. observer：观察者、订阅者；

在“事件驱动”式软件中，subject 又叫事件流（stream of events）或事件流源（stream source of events），observers 叫“sinks of events”。大致理解就是，哪里产生事件，哪里就是subject。

在 controller 和 view 的通信中，哪部分扮演 subject？那部分扮演 observers？

从事件发生处当作 subject 可知，view 应该作为发布者，controller 是订阅者，因为用户的交互事件只有在 view 中监听到。

举例：实现搜索功能，获取用户输入，请求api服务器，获取结果后，渲染结果列表

```js
// view
// in src/js/views/searchView.js
class SearchView {
  addEventHandler(handler) {
  this._parentElment.addEventListener('submit', function(e) {
    e.preventDefault();
    handler();
  });
  }
}

export default new SearchView();

// controller
// in src/js/controller.js

// 响应搜索框的输入，获取数据渲染结果列表
const searchListController = async function() {
  resultView.renderSpinner();
  // 获取表单view的输入
  const query = searchView.getInput();
  if(!query) return;

  try {
    // 请求api
    await model.getSearchResults(query);

    // 将结果渲染到相应的view中
    resultView.render(model.getSearchResultsPage());
  } catch(err) {
    console.log(err);
    resultView.renderError(err);
  }
}

export default function init () {
  searchView.addEventHandler(searchListController);
}
```

两者通信的方式小结：

- view 收集依赖，或叫订阅者订阅消息处理函数，具体方式是订阅者对象对外暴露一个**可传入回调**的方法，由外界调用并传入回调，传入回调的过程就是收集依赖；
- view 中发生事件时，调用传入的回调，通知订阅者。