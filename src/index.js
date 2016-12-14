// State types
const BEFORE_ENGAGED = 0;
const ENGAGED        = 1;

const defaultOptions = {
  sensitivity: 7,   // in pixels
  interval   : 400, // in milliseconds
  timeout    : 0    // in milliseconds
}

class eventSensitivityControl {
  /**
   * @param  element       - the target element
   * @param  onOverHandler - a handler for mouseover event
   * @param  onOutHandler  - a handler for mouseout event
   * @param  options
   */
  constructor(element, onOverHandler, onOutHandler, options=defaultOptions) {
    console.log("constructor");
    console.log(this.element);

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
    this.pointX;
    this.pointY;

    // Current controlState
    this.controlState = BEFORE_ENGAGED;

    // The id of currently set timer. It will become undefined when the time is cancelled.
    this.timer = 0;

    // Bootstraps the library.
    if (this.element) {
      this.element.addEventListener('mouseover', this.dispatchEnter, false);
      this.element.addEventListener('mouseout', this.dispatchExit, false);
    }
  }


  // ---
  // PUBLIC METHODS
  // ---


  /**
   * Cleans up all the listeners.
   */
  remove = () => {
    if (!this.element) return;

    this.element.removeEventListener('mouseover', this.dispatchEnter, false);
    this.element.removeEventListener('mouseout', this.dispatchExit, false);
  }


  // ---
  // EVENT DISPATCHERS
  // ---


  dispatchEnter = (e) => {
    if (this.timer) {
      this.timer = clearTimeout(this.timer);
    }

    this.element.removeEventListener('mousemove', this.tracker, false);

    if (this.controlState !== ENGAGED) {
      this.pointX = e.clientX;
      this.pointY = e.clientY;

      this.element.addEventListener('mousemove', this.tracker, false);

      this.timer = setTimeout(() => {
        this.compare(this.element, e);
      }, this.options.interval);
    }
  }

  dispatchExit = (e) => {
    if (this.timer) {
      this.timer = clearTimeout(this.timer);
    }

    this.element.removeEventListener('mousemove', this.tracker, false);

    if (this.controlState === ENGAGED) {
      this.timer = setTimeout(() => {
        this.delay(this.element, e);
      }, this.options.timeout);
    }
  }


  // ---
  // TRACKER
  // ---


  /**
   * Stores to the variables the XY positon within the application's client area
   * at which the event occurred.
   */
  tracker = (e) => {
    this.x = e.clientX;
    this.y = e.clientY;

    // Update the values on the UI.
    document.querySelector('#x').innerHTML = this.x;
    document.querySelector('#y').innerHTML = this.y;
    document.querySelector('#timer').innerHTML = this.timer;
  }


  // ---
  // TIMERS
  // ---


  delay = (el, e) => {
    if (this.timer) {
      this.timer = clearTimeout(this.timer);
    }

    this.controlState = BEFORE_ENGAGED;

    this.onOutHandler.call(this.element, e);
  }

  compare = (el, e) => {
    if (this.timer) {
      this.timer = clearTimeout(this.timer);
    }

    const deltaX = Math.abs(this.pointX - this.x);
    const deltaY = Math.abs(this.pointY - this.y);
    const withinSensitivity = (deltaX + deltaY < this.options.sensitivity)

    if (withinSensitivity) {
      this.controlState = ENGAGED;
      this.onOverHandler.call(el, e);

    } else {
      this.pointX = this.x;
      this.pointY = this.y;

      this.timer = setTimeout(() => {
        this.compare(el, e);
      }, this.options.interval);
    }
  }

} // end class
