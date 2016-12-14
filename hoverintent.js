'use strict';

// State types
const BEFORE_ENGAGED = 0;
const ENGAGED        = 1;

// Keep track of XY positions in the clients' view.
// E.g., Clicking in the top-left corner of the client area will always result
// in a mouse event with a clientX value of 0, regardless of whether the page is scrolled.
var x, y, pX, pY;

// ???
var h = {};

// Current control state
var controlState = BEFORE_ENGAGED;

// The id of currently set timer. It will become undefined when the time is cancelled.
var timer = 0;

var defaultOptions = {
  sensitivity: 7,
  interval   : 100,
  timeout    : 0
};

function eventSensitivityControl(el, onOverHandler, onOutHandler, options=defaultOptions) {

  // Public methods
  h.options = function (opt) {
    options = Object.assign({}, options, opt);
    return h;
  };


  // ---
  // EVENT DISPATCHERS
  // ---


  function dispatchOver(e) {
    if (timer) timer = clearTimeout(timer);
    el.removeEventListener('mousemove', tracker, false);

    if (controlState !== ENGAGED) {
      pX = e.clientX;
      pY = e.clientY;

      el.addEventListener('mousemove', tracker, false);

      timer = setTimeout(function () {
        compare(el, e);
      }, options.interval);
    }

    return this;
  }

  function dispatchOut(e) {
    if (timer) timer = clearTimeout(timer);
    el.removeEventListener('mousemove', tracker, false);

    if (controlState === ENGAGED) {
      timer = setTimeout(function () {
        delay(el, e);
      }, options.timeout);
    }

    return this;
  }


  // ---
  // TRACKER
  // ---


  /**
   * Stores to the variables the XY positon within the application's client area
   * at which the event occurred.
   */
  function tracker(e) {
    x = e.clientX;
    y = e.clientY;

    // Update the values on the UI.
    document.querySelector('#x').innerHTML = x;
    document.querySelector('#y').innerHTML = y;
    document.querySelector('#timer').innerHTML = timer;

    console.log(pX + ' ' + pY)
  }


  // ---
  // TIMERS
  // ---


  function delay(el, e) {
    if (timer) {
      timer = clearTimeout(timer);
    }

    controlState = BEFORE_ENGAGED;
    return onOutHandler.call(el, e);
  }


  function compare(el, e) {
    if (timer) timer = clearTimeout(timer);
    if (Math.abs(pX - x) + Math.abs(pY - y) < options.sensitivity) {
      controlState = 1;
      return onOverHandler.call(el, e);
    } else {
      pX = x;
      pY = y;
      timer = setTimeout(function () {
        compare(el, e);
      }, options.interval);
    }
  }


  // ---
  // PUBLIC METHODS
  // ---


  h.remove = function () {
    if (!el) return;
    el.removeEventListener('mouseover', dispatchOver, false);
    el.removeEventListener('mouseout', dispatchOut, false);
  };

  if (el) {
    el.addEventListener('mouseover', dispatchOver, false);
    el.addEventListener('mouseout', dispatchOut, false);
  }

  return h;
};
