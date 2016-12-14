// ---
// GLOBALS
// ---


// State types
const BEFORE_ENGAGED = 0;
const ENGAGED        = 1;

// Keep track of XY positions in the clients' view.
// E.g., Clicking in the top-left corner of the client area will always result
// in a mouse event with a clientX value of 0, regardless of whether the page is scrolled.
let x;
let y;
let xMoveStart;
let yMoveStart;

// Current state
let state = BEFORE_ENGAGED;

// The id of currently set timer. It will become undefined when the time is cancelled.
let timer = undefined;


// ---
// ---


/**
 * @param  el            - the target element
 * @param  onOverHandler - a handler function for mouseover event
 * @param  onOutHandler  - a handler function for mouseout event
 */
export default (el, onOverHandler, onOutHandler) => {

  let options = {
    sensitivity: 7,
    /* The length of time (in milliseconds) hoverintent waits to re-read mouse coordinates */

    interval: 100,
    /* The length of time (in milliseconds) before the mouseout event is fired */

    timeout: 0
  };


  setup();


  // ---
  // INITIALIZER AND DESTRUCTOR
  // ---


  /**
   * Bootstraps the library.
   */
  function setup() {
    if (el) {
      el.addEventListener('mouseover', dispatchEnter, false);
      el.addEventListener('mouseout', dispatchExit, false);
    }
  }

  /**
   * Cleans up the library.
   */
  function remove() {
    el.removeEventListener('mouseover', dispatchEnter, false);
    el.removeEventListener('mouseout', dispatchExit, false);
  };


  // ---
  // EVENT DISPATCHERS
  // ---


  /**
   * @param  e - event that is triggered in setup methods.
   */
  function dispatchEnter(e) {
    // Clean up old stuff.
    resetTimer();
    el.removeEventListener('mousemove', tracker, false);

    // Reject if delay timer is in effect.
    if (state === BEFORE_ENGAGED) return;

    setMoveStartPosition(e.clientX, e.clientY);
    setCompareTimer();

    // ???
    el.addEventListener('mousemove', tracker, false);
  }

  /**
   * @param  e - event that is triggered in remove methods.
   */
  function dispatchExit(e) {
    resetTimer();
    el.removeEventListener('mousemove', tracker, false);

    if (state === ENGAGED) setDelayTimer();
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
  }


  // ---
  // TIMER SETTERS AND RESETTER
  // ---


  /**
  * ???
  */
  function setDelayTimer() {
    timer = setTimeout(() => {
      delay(el, e);
    }, options.timeout);

    return timer;
  }


  /**
  * ??? Compare for what???
  */
  function setCompareTimer() {
    timer = setTimeout(() => {
      compare(el, e);
    }, options.interval);

    return timer;
  }


  /**
  * Resets the currently set timer.
  * NOTE: timer will be undefined.
  */
  function resetTimer() {
    if (timer) timer = clearTimeout(timer);

    return timer;
  }



  // ---
  // ???
  // ---


  function setMoveStartPosition(x, y) {
    xMoveStart = x;
    yMoveStart = y;
  }


  /**
   * @param  {[type]} el [description]
   * @param  {[type]} e  [description]
   * @return {[type]}    [description]
   */
  function delay(el, e) {
    resetTimer();
    state = BEFORE_ENGAGED;
    
    return onOutHandler.call(el, e);
  }

  /**
   * [compare description]
   * @param  {[type]} el [description]
   * @param  {[type]} e  [description]
   * @return {[type]}    [description]
   */
  function compare(el, e) {
    resetTimer();

    // FIXME
    const howMuchMoved = (Math.abs(xMoveStart - x) + Math.abs(yMoveStart - y));
    const withinSensitivity = howMuchMoved < options.sensitivity

    if (withinSensitivity) {
      state = ENGAGED;
      onOverHandler.call(el, e);
      // If the move was within the sensitivity range, do the things that are
      // specified in the onOverHandler.
    } else {
      setMoveStartPosition(x, y);
      setCompareTimer();
      // If the move was outside the sensitivity range, store the current position
      // and set the compare timer.
    }
  }

  // Return the function to remove the whole effect.
  return remove;
};
