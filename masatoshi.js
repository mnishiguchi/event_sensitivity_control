// State types
const BEFORE_ENGAGED = 0;
const ENGAGED        = 1;

const defaultOptions = {
  sensitivity: 400,
  /* The length of time (in milliseconds) hoverintent waits to re-read mouse coordinates */

  interval: 400,
  /* The length of time (in milliseconds) before the mouseout event is fired */

  timeout: 0
}

class controlEvent {

  /**
   * @param  element       - the target element
   * @param  onOverHandler - a handler for mouseover event
   * @param  onOutHandler  - a handler for mouseout event
   * @param  options
   */
  constructor(element, onOverHandler, onOutHandler, options=defaultOptions) {
    console.log("constructor");

    // Store the references to the passed-in values.
    this.element       = element;
    this.onOverHandler = onOverHandler;
    this.onOutHandler  = onOutHandler;
    this.options       = options;

    // Keep track of XY positions in the clients' view.
    // E.g., Clicking in the top-left corner of the client area will always result
    // in a mouse event with a clientX value of 0, regardless of whether the page is scrolled.
    this.x;
    this.y;
    this.moveStartX;
    this.moveStartY;

    // Current controlState
    this.controlState = BEFORE_ENGAGED;

    // The id of currently set timer. It will become undefined when the time is cancelled.
    this.timer = undefined;

    // Bootstraps the library.
    this.setup();
  }


  // ---
  // INITIALIZER AND DESTRUCTOR
  // ---


  /**
   * Bootstraps the library.
   */
  setup = () => {
    console.log("setup");
    console.log(this.element);

    if (this.element) {
      this.element.addEventListener('mouseover', this.dispatchEnter, false);
      this.element.addEventListener('mouseout', this.dispatchExit, false);
    }
  }

  /**
   * Cleans up the library.
   */
  remove = () => {
    this.element.removeEventListener('mouseover', this.dispatchEnter, false);
    this.element.removeEventListener('mouseout', this.dispatchExit, false);
  }


  // ---
  // EVENT DISPATCHERS
  // ---


  /**
   * @param  event - event that is triggered in setup methods.
   */
  dispatchEnter = (event) => {
    console.log(`dispatchEnter`)

    // Clean up old timer.
    this.resetTimer();

    // Start tracking the mouse postion.
    this.element.addEventListener('mousemove', this.tracker, false);

    // Reject if the control is engaged yet.
    if (this.controlState === BEFORE_ENGAGED) {
      return;
    }

    // Set the timer.
    this.setMoveStartPosition(event.clientX, event.clientY);
    this.setCompareTimer();
  }

  /**
   * @param  event - event that is triggered in remove methods.
   */
  dispatchExit = (event) => {
    console.log(`dispatchExit`)

    this.resetTimer();
    this.element.removeEventListener('mousemove', ()=>{}, false);

    if (this.controlState === ENGAGED) {
      this.setDelayTimer();
    }
  }


  // ---
  // TRACKER
  // ---


  /**
   * Stores to the variables the XY positon within the application's client area
   * at which the event occurred.
   */
  tracker = (event) => {
    // Update the current location.
    this.x = event.clientX;
    this.y = event.clientY;

    // Update the values on the UI.
    document.querySelector('#x').innerHTML = this.x;
    document.querySelector('#y').innerHTML = this.y;
    document.querySelector('#timer').innerHTML = this.timer;
  }


  // ---
  // TIMER SETTERS AND RESETTER
  // ---


  /**
  * ???
  */
  setDelayTimer = () => {
    console.log(`setDelayTimer`)

    this.timer = setTimeout(() => {
      delay(event);
    }, this.options.timeout);
  }


  /**
  * ??? Compare for what???
  */
  setCompareTimer = () => {
    console.log(`setCompareTimer`)

    this.timer = setTimeout(() => {
      this.compare(event);
    }, this.options.interval);
  }


  /**
  * Resets the currently set timer.
  * NOTE: timer will be undefined.
  */
  resetTimer = () => {
    console.log(`resetTimer for #${this.timer}`)

    if (this.timer) {
      this.timer = clearTimeout(this.timer);
    }
  }


  // ---
  // ???
  // ---


  setMoveStartPosition = (x, y) => {
    console.log(`setMoveStartPosition`)

    this.moveStartX = this.x;
    this.moveStartY = this.y;
  }


  /**
   * @param  {[type]} el [description]
   * @return {[type]}    [description]
   */
  delay = (event) => {
    console.log(`delay`)

    this.resetTimer();
    this.controlState = BEFORE_ENGAGED;

    this.onOutHandler.call(event);
  }

  /**
   * Compares current and previous mouse positions.
   */
  compare = (event) => {
    console.log(`compare`)

    this.resetTimer();

    const deltaX = Math.abs(this.xMoveStart - this.x);
    const deltaY = Math.abs(this.yMoveStart - this.y);

    const howMuchMoved = deltaX + deltaY; // FIXME
    const withinSensitivity = (howMuchMoved < this.options.sensitivity)

    if (withinSensitivity) {
      this.controlState = ENGAGED;
      this.onOverHandler.call(event);
      // If the move was within the sensitivity range, do the things that are
      // specified in the onOverHandler.

    } else {
      this.setMoveStartPosition();
      this.setCompareTimer();
      // If the move was outside the sensitivity range, store the current position
      // and set the compare timer.
    }
  }

} // end class
