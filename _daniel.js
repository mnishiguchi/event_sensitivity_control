export default (el, onOver, onOut) => {
  const BEFORE_ENGAGED = 0;
  const ENGAGED        = 1;
  let x;
  let y;
  let xAfterMove;
  let yAfterMove;
  let state = BEFORE_ENGAGED;
  let timer = 0;
  let options = {
    sensitivity: 7,
    /* The length of time (in milliseconds) hoverintent waits to re-read mouse coordinates */
    interval: 100,
    /* The length of time (in milliseconds) before the mouseout event is fired */
    timeout: 0
  };
  function resetTimer() {
    if (timer) timer = clearTimeout(timer);
  }
  function setCompareTimer() {
    timer = setTimeout(() => {
      compare(el, e);
    }, options.interval);
  }
  function setDelayTimer() {
    timer = setTimeout(() => {
      delay(el, e);
    }, options.timeout);
  }
  function resetForNextCompare(x, y) {
    xAfterMove = x;
    yAfterMove = y;
    setCompareTimer();
  }
  function delay(el, e) {
    resetTimer();
    state = BEFORE_ENGAGED;
    return onOut.call(el, e);
  }
  function tracker(e) {
    x = e.clientX;
    y = e.clientY;
  }
  function compare(el, e) {
    resetTimer();
    let withinSensitivity = (Math.abs(xAfterMove - x) + Math.abs(yAfterMove - y)) < options.sensitivity
    if (withinSensitivity) {
      state = ENGAGED;
      return onOver.call(el, e);
    }
    resetForNextCompare(x, y)
  }
  function dispatchEnter(e) {
    resetTimer();
    el.removeEventListener('mousemove', tracker, false);
    if (state === BEFORE_ENGAGED) return this;
    resetForNextCompare(e.clientX, e.clientY)
    el.addEventListener('mousemove', tracker, false);
    return this;
  }
  /* Remove MouseMove, */
  function dispatchExit(e) {
    resetTimer();
    el.removeEventListener('mousemove', tracker, false);
    if (state === ENGAGED) setDelayTimer();
    return this;
  }
  function initialize() {
    if (el) {
      el.addEventListener('mouseover', dispatchEnter, false);
      el.addEventListener('mouseout', dispatchExit, false);
    }
  }
  return {
    options: (opt) => {
      options = extend({}, options, opt);
      return hoverIntentObject;
    },
    remove: () => {
      el.removeEventListener('mouseover', dispatchEnter, false);
      el.removeEventListener('mouseout', dispatchExit, false);
    };
  };
};
