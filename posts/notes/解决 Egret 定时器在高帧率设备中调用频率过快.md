---
title: 'egret-timer-issue-in-high-frame-rate'
date: '2021-11-09'
year: '2021'
abstract: '兼容高刷新率设备的 Egret 定时器处理方式'
---

# 解决 Egret 定时器在高帧率设备中计数过快的问题

说明问题前先区别两个概念：
  1. 游戏引擎的 game loop 的频率，引擎执行一次 game loop 会生成一副完整的游戏界面，也叫一帧（frame），game loop 的频率即 fps（frame per second），这是游戏程序支持的特性；
  2. 屏幕的刷新率，显示器每秒生成的画面，一个画面也叫一帧（frame），以赫兹（Hz）为单位，常见的显示器刷新率有 60Hz，高的可达 144Hz、240 Hz

fps 和屏幕刷新率没有关系，fps 靠游戏程序来支持，屏幕刷新率则是硬件（显卡、显示器）的特性。

本文大纲：
1. 提出 Egret 定时器在高屏幕刷新率的设备上执行过快的现象
2. 几种兼容高刷新率设备的定时器解决方式
3. 探究为什么 Egret 定时器会这么表现

## 1. 问题

Egret 的定时器基于屏幕刷新率更新，在 60 Hz 设备上，输入 1000ms，会正确地计时 1s，但在更高刷新率的设备上，输入 1000ms，定时器实际执行时间是 1000/（真实刷新率/60），如，在 240Hz 的设备上，以 1000ms 为间隔执行 4 次定时器回调，预期总的执行时间为 4s，但实际上 1s 就会执行完

```ts
let timer = new egret.Timer(1000, 4);
time.start();
```

该定时器会在 1s 左右执行完成，派发 `TimerEvent.TIMER_COMPLETE` 事件，因此使用定时器来管理游戏中的动画会出现高帧率设备上动画执行过快的现象。

有几种方式可对高帧率的设备做兼容：

## 2. 解决方式

### 解法1：每次输入延迟时都乘以一个帧倍率

如果希望一个计时器以 1s 延迟，执行 4 次：

```ts
new egret.Timer(1000, 4);
```

它在不同刷新率设备上的运行结果是：
- 在 60Hz 设备上，能正常计数，4 秒执行完毕
- 在 120Hz 设备上，会以 0.5s 执行 1 次，2 秒执行完毕
- 在 240Hz 设备上，会以 0.25s 执行 1 次，1 秒执行完毕

基于这个规律，定时器的延迟以 60fps 为基准，那么在 120Hz 设备上的 1s 相当于 60fps 的 2s，所以传入的延迟时间应该是 `2000`ms，即延迟时间要根据当前设备的刷新率动态进行计算，算法是 delay * 帧倍率。帧倍率指当前设备的刷新率基于 60Hz 倍数。

做法：可以在游戏一开始时设置 1s 载入时间计算当前设备的帧率，除以 60 得到帧倍率，保存到游戏全局变量。之后每次传入延迟时间时都乘以这个帧倍率，实现方式：

```ts
// 在游戏的 Loading 时设置当前设备基于 60 的倍率，保存为全局变量
public LoadingUI extends eui.Component {
  private timeList: number[] = [];
  private lastTime: number

  public setFrameRate() {
    this.addEventListener(egret.Event.ENTER_FRAME, this.recordFrameRates, this);

    this.lastTime = egret.getTimer();
    // 在 1s 内计算帧倍率
    let p = egret.setTimeout(() => {
      egret.clearTimeout(p);
      // 每进入一帧执行回调，这个一帧指设备刷新的一帧
      this.removeEventListener(egret.Event.ENTER_FRAME, this.recordFrameRates, this)

      const length = this.timeList.length;
      if(length > 0) {
        let sum = 0;
        this.timeList.forEach(time => sum += time);
        const actualFrameTime = sum / length; // 本设备刷新1帧的时间
        const defaultFrameTime = 1000 / 60;
        // 算出帧倍率，保存为全局变量
        GameData.frameRate = defaultFrameTime / actualFrameTime;
      }
    })
  }

  public recordFrameRates() {
    let currentTime = egret.getTimer();
    this.timeList.push(currentTime - this.lastTime);
    this.lastTime = currentTime;
  }
}
```

计算得到 `GameData.frameRate`后，在每次使用定时器输入延迟时间时乘以这个帧倍率：

```ts
let timer = new egret.Timer(GameData.frameRate * 1000, 4);
```

### 解法2：回调内部管理一个变量控制执行频率，类似节流

解决思路：外部管理一个 `lastTimeStamp` 变量，在每次回调内部计算 `nowTimeStamp`，后者减去前者的时间差 `deltaTime` 大于等于预期的 delay 则执行回调。

```ts
public class Game extends eui.Component {
  public lastTimeStamp: number;
  private timer: egret.Timer

  private timerCallBack() {
    let nowTime = egret.getTimer();

    // 如果两个时间差与预期的 1000 在可接受误差范围内，才执行正常计时事件
    if (Math.abs(nowTime - this.lastTimeStamp - 1000) < 100) {
      this.lastTimeStamp = nowTime

      // 以下执行预期的定时器事件
    }
  }

  private startTimer() {
    this.lastTimeStamp = egret.getTimer();

    // 开始调用传入定时器的回调
    this.timer.start();
  }
}
```

### 解法3：使用 setTimeout(), setInterval() 代替 Egret Timer

Egret timer 最终是基于 `requestAnimationFrame` 进行调用，setTimeout(), setInterval() 的定时器则基于宏任务管理，不受屏幕刷新率影响。但由于它们的回调是以宏任务的颗粒度进行，对于时间精度控制不那么完美时间的情况下可采用此方法。

### 解法4：修改 Timer 的源码

可修改源码以兼容高刷新率设备，在 Timer 中，将 lastCount 的初始值设为 `60 * delay * 帧倍率`，下一节说明为什么这种方法可行：

```ts
// egret-core/src/egret/utils/Timer.ts
export class Timer extends EventDispatcher {
  public set delay(value: number) {
    if (value < 1) {
        value = 1;
    }
    if (this._delay == value) {
        return;
    }
    this._delay = value;
    // this.lastCount = this.updateInterval = Math.round(60 * value);
    // 改为 frameRate 是当前设备对 60Hz 的倍率，需要动态计算，120Hz 的设备为 2,
    this.lastCount = this.updateInterval = Math.round(60 * value * frameRate);
  }
}
```

### 3. Timer 为何受设备刷新率影响

TL;DR，先说结论：

1. Egret 引擎初始化时会以 `requestAnimationFrame` 的频率执行 `SystemTicker` 的单例 `ticker` 的 `update()` 方法。
2. 创建一个 Egret Timer 时，会将 Timer 对象的 `$update()` 方法保存到 ticker 的回调列表，并在ticker 的 `update()` 中调用，导致一个 Timer 启动后也根据 `requestAnimationFrame` 的频率执行 `$update()` 方法。
3. `$update()` 方法内部以 `60次调用=1000ms` 为判断基准，计算每次回调是否达到了输入的延迟时间，120Hz 的设备调用回调很快，造成计时过快。

先看 Timer 的([源代码](https://github.com/egret-labs/egret-core/blob/master/src/egret/utils/Timer.ts#L69))

```ts
// egret-core/src/egret/utils/Timer.ts
export class Timer extends EventDispatcher {
  public constructor(delay: number, repeatCount: number = 0) {
    super();
    this.delay = delay;
    this.repeatCount = +repeatCount | 0;
  }
  public set delay(value: number) {
    if (value < 1) {
        value = 1;
    }
    if (this._delay == value) {
        return;
    }
    this._delay = value;
    this.lastCount = this.updateInterval = Math.round(60 * value); // 重点，这个 lastCount 控制在 ticker 的频繁调用中，是否达到了一次 delay，初始值为 60 * delay
  }
  public start() {
    if (this._running) return;
    this.lastCount = this.updateInterval;
    this.lastTimeStamp = getTimer();
    ticker.$startTick(this.$update, this); // 重点，启动定时器是将定时器的 $update 方法作为参数，传入 ticker.$startTick 方法中，这里看出定时器的更新基于 ticker 
    this._running = true;
  }
  // $update 实现 Timer 的一次更新，具体来说是增加一个 currentCount 计数，并派发 TimerEvent 事件，并判断是否达到 Timer 的结束
  $update(timeStamp: number): boolean {
    let deltaTime = timeStamp - this.lastTimeStamp;
    if (deltaTime >= this._delay) {
        this.lastCount = this.updateInterval;
    }
    else {
      this.lastCount -= 1000;
      if (this.lastCount > 0) {
          return false;
      }
      this.lastCount += this.updateInterval;
    }
    this.lastTimeStamp = timeStamp;
    this._currentCount++;
    let complete = (this.repeatCount > 0 && this._currentCount >= this.repeatCount);
    if (this.repeatCount == 0 || this._currentCount <= this.repeatCount) {
        egret.TimerEvent.dispatchTimerEvent(this, egret.TimerEvent.TIMER);
    }
    if (complete) {
        this.stop();
        TimerEvent.dispatchTimerEvent(this, TimerEvent.TIMER_COMPLETE);
    }
    return false;
  }
}
```

从 Timer 得到两个结论：
1. ticker 会以一定频率调用 `$update` 方法，看后面的源码知道，这个频率就是设备的刷新率，跟设备有关，与 Egret 引擎设置的帧率无关，Egret 引擎设置的帧率影响的是它对时间间隔的计算。
2. `$update` 内部用 `lastCount` 变量管理是否达到了一次延迟。lastCount 初始值 60 * delay，每次固定减 1000，减到 0 时触发一次 Timer 事件。如计时 1000ms，需 60 次调用触发一次 Timer 事件，注意，这个`60次调用 = 1000ms` 的映射已经 hardcode 在这里源码中， 60 Hz 设备用完成 60 次调用花 1s，120Hz 设备完成 60 次调用只要 0.5 秒，这是造成计时不准确的直接原因。

接下来看 ticker 如何以系统的刷新率调用 `$update`，来到 `ticker` 的[代码](https://github.com/egret-labs/egret-core/blob/f7919d26a230d99c3b1f5b938b326159a2225e47/src/egret/player/SystemTicker.ts)，首先要看它的 `$startTick`

```ts
// egret-core/src/egret/player/SystemTicker.ts
export class SystemTicker {
  $startTick(callBack: (timeStamp: number) => boolean, thisObject: any): void {
    let index = this.getTickIndex(callBack, thisObject);
    if (index != -1) {
        return;
    }
    this.concatTick();
    this.callBackList.push(callBack); // 重点，将 Timer 中的 $update 放入 ticker 的 callBackList
    this.thisObjectList.push(thisObject);
  }
}
```

`$startTick` 只是将回调函数加入 ticker 的 callBackList 中，那么回调们在哪里执行呢？要看 ticker 的核心方法: `update()`：

```ts
// 同样位于 SystemTicker 类，略去了与定时器回调不相关的代码
/**
 * @private
 * 执行一次刷新
 */
public update(forceUpdate?: boolean): void {
    let callBackList = this.callBackList;
    let thisObjectList = this.thisObjectList;
    let length = callBackList.length;

    let timeStamp = egret.getTimer();

    for (let i = 0; i < length; i++) {
      // 重点，update 方法内执行 ticker 的所有回调
      if (callBackList[i].call(thisObjectList[i], timeStamp)) { 
          requestRenderingFlag = true;
      }
    }
}
```

这里我们看到 ticker 每执行一次 `update` 就执行一次 Timer 的 `$update`，那么 ticker 的 `update` 又是在哪里调用，以怎么频率调用？来到最后一站：`runEgret()` 方法的[代码](https://github.com/egret-labs/egret-core/blob/f7919d26a230d99c3b1f5b938b326159a2225e47/src/egret/web/EgretWeb.ts)

```ts
// egret-core/src/egret/web/EgretWeb.ts
/**
 * @private
 * 网页加载完成，实例化页面中定义的Egret标签
 */
function runEgret(options?: runEgretOptions): void {
  if (ua.indexOf("egretnative") >= 0 && egret.nativeRender) {
    // Egret Native
  } else {
    // 此处位于源码 172 行
    let ticker = egret.ticker; // egret.ticker = new egret.sys.SystemTicker();
    startTicker(ticker); // 重点，startTicker 启动了心跳计时器单例 ticker
  }

  /**
   * @private
   * 启动心跳计时器。
  */
  function startTicker(ticker: egret.sys.SystemTicker): void {
    let requestAnimationFrame =
        window["requestAnimationFrame"] ||
        window["webkitRequestAnimationFrame"] ||
        window["mozRequestAnimationFrame"] ||
        window["oRequestAnimationFrame"] ||
        window["msRequestAnimationFrame"];

    if (!requestAnimationFrame) {
        requestAnimationFrame = function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
    }

    requestAnimationFrame(onTick);
    function onTick(): void {
        requestAnimationFrame(onTick);
        ticker.update(); // 重点，以 requestAnimationFrame 的频率回调 ticker 的 update 方法
    }
  }
}
```

从上面看到 `startTicker` 就是以浏览器的 `requestAnimationFrame` 的调用频率调用计时单例 ticker。

综上，整个过程如下：
1. Egret 引擎初始化时会以 `requestAnimationFrame` 的频率执行 SystemTicker 的单例 ticker 的 `update()` 方法。 
2. 创建一个 Egret Timer 时，会将 Timer 对象的 `$update()` 方法保存到 ticker 的回调列表，并在ticker 的 `update()` 中调用，即 Timer 启动后也根据 `requestAnimationFrame` 的频率执行 `$update()` 方法。
3. `$update()` 方法内部 `60次调用=1000ms` 为判断基准，计算每次回调中是否达到了输入的延迟时间，120Hz 的设备调用回调很快，造成计时过快的现象。

如要修改源码以兼容高刷新率设备的话，在 Timer 中，将 lastCount 的初始值设为 `60 * delay * 帧倍率`：

```ts
// egret-core/src/egret/utils/Timer.ts
export class Timer extends EventDispatcher {
  public set delay(value: number) {
    if (value < 1) {
        value = 1;
    }
    if (this._delay == value) {
        return;
    }
    this._delay = value;
    // this.lastCount = this.updateInterval = Math.round(60 * value);
    // 上面那一行改为以下。frameRate 是当前设备对 60Hz 的倍率，需要动态计算，如 120Hz 的设备为 2,
    this.lastCount = this.updateInterval = Math.round(60 * value * frameRate);
  }
}
```
