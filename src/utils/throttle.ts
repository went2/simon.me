export default function throttle(
  fn: (...args: any[]) => void,
  interval: number,
  immediate = true
) {
  let lastInvoked = 0;
  const _throttle = function (...args: any[]) {
    const currentTime = Date.now();

    if (!immediate && lastInvoked === 0) {
      lastInvoked = currentTime;
    }

    const waitTime = interval - (currentTime - lastInvoked);
    if (waitTime <= 0) {
      //@ts-ignore
      fn.apply(this, args);
      lastInvoked = currentTime;
    }
  };
  return _throttle;
}
