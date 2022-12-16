---
title: '解决 Egret 定时器在高帧率设备中计数过快'
date: '2021-11-09'
year: '2021'
abstract: '兼容高刷新率设备的 Egret 定时器处理方式'
---

# 解决 Egret 定时器在高帧率设备中计数过快

## 问题

Egret 的定时器基于刷新率更新，最高支持到 60 fps，在更高刷新率的设备上，定时器的执行会加快。开发中需要对高帧率的设备做额外兼容。有几种方式：

## 解法1：设置帧率为 60

```html
// in index.html
<div
  class="egret-player"
  data-frame-rate="60"
>
</div>

```

## 解法2：每次使用延迟时都乘以一个帧倍率

如果希望一个计时器以 1s 延迟，执行 4 次：

```ts
new egret.Timer(1000, 4);
```

- 在 60 fps 设备上，能正常计数，4 秒执行完毕
- 在 120 fps 设备上，以 0.5s 执行 1 次，2 秒执行完毕
- 在 240 fps 设备上，以 0.25 执行 1 次，1 秒执行完毕

希望 120 fps 的设备正常执行，传入的延迟时间得是 `1000 * (120/60)`。在游戏一开始可以设置 1s 载入时间计算设备的帧率，除以 60 得到帧倍率，之后每次传入延迟时间时都乘以这个帧倍率。

```ts
public LoadingUI extends eui.Component {
  private timeList: number[] = [];
  private lastTime: number

  public setFrameRate() {
    this.addEventListener(egret.Event.ENTER_FRAME, this.recordFrameRates, this);

    this.lastTime = egret.getTimer();
    // 在 1s 内计算帧倍率
    let p = egret.setTimeout(() => {
      egret.clearTimeout(p);
      // 每进入一帧执行回调，帧率由设备帧率决定
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
    let nowTime = egret.getTimer();
    this.timeList.push(nowTime - this.lastTime);
    this.lastTime = nowTime;
  }
}
```

## 解法3：回调内部管理一个变量控制执行频率，类似节流

解决思路：外部管理一个 `lastTimeStamp` 变量，在每次回调内部计算 `nowTimeStamp`，如何后者减去前者大于等于*预期值*则执行回调。

```ts
public class Game extends eui.Component {
  public lastTimeStamp: number;

  private timerCallBack() {
    private timer: egret.Timer
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

## 解法4：使用 setTimeout(), setInterval() 代替 Egret timer

Egret timer 基于刷新率进行计数，setTimeout(), setInterval() 的定时由浏览器内部管理，不受屏幕刷新率影响。但其回调放入宏任务队列执行，一个宏任务每次执行前都需要清空微任务队列，可能会造成定时不准确，建议使用 Egret timer 然后用以上几种方式打准确补丁。