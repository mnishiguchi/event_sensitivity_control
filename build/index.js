'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// State types
var BEFORE_ENGAGED = 0;
var ENGAGED = 1;

var defaultOptions = {
  sensitivity: 7, // in pixels
  interval: 400, // in milliseconds
  timeout: 0 // in milliseconds
};

var EventSensitivityControl =
/**
 * @param  element       - the target element
 * @param  onOverHandler - a handler for mouseover event
 * @param  onOutHandler  - a handler for mouseout event
 * @param  options
 */
function EventSensitivityControl(element, onOverHandler, onOutHandler, options) {
  var _this = this;

  _classCallCheck(this, EventSensitivityControl);

  this.remove = function () {
    if (!_this.element) return;

    _this.element.removeEventListener('mouseover', _this.dispatchEnter, false);
    _this.element.removeEventListener('mouseout', _this.dispatchExit, false);
  };

  this.dispatchEnter = function (e) {
    if (_this.timer) {
      _this.timer = clearTimeout(_this.timer);
    }

    _this.element.removeEventListener('mousemove', _this.tracker, false);

    if (_this.controlState !== ENGAGED) {
      _this.pointX = e.clientX;
      _this.pointY = e.clientY;

      _this.element.addEventListener('mousemove', _this.tracker, false);

      _this.timer = setTimeout(function () {
        _this.compare(_this.element, e);
      }, _this.options.interval);
    }
  };

  this.dispatchExit = function (e) {
    if (_this.timer) {
      _this.timer = clearTimeout(_this.timer);
    }

    _this.element.removeEventListener('mousemove', _this.tracker, false);

    if (_this.controlState === ENGAGED) {
      _this.timer = setTimeout(function () {
        _this.delay(_this.element, e);
      }, _this.options.timeout);
    }
  };

  this.tracker = function (e) {
    _this.x = e.clientX;
    _this.y = e.clientY;

    // // Update the values on the UI.
    // document.querySelector('#x').innerHTML = this.x;
    // document.querySelector('#y').innerHTML = this.y;
    // document.querySelector('#timer').innerHTML = this.timer;
  };

  this.delay = function (el, e) {
    if (_this.timer) {
      _this.timer = clearTimeout(_this.timer);
    }

    _this.controlState = BEFORE_ENGAGED;

    _this.onOutHandler.call(_this.element, e);
  };

  this.compare = function (el, e) {
    if (_this.timer) {
      _this.timer = clearTimeout(_this.timer);
    }

    var deltaX = Math.abs(_this.pointX - _this.x);
    var deltaY = Math.abs(_this.pointY - _this.y);
    var withinSensitivity = deltaX + deltaY < _this.options.sensitivity;

    if (withinSensitivity) {
      _this.controlState = ENGAGED;
      _this.onOverHandler.call(el, e);
    } else {
      _this.pointX = _this.x;
      _this.pointY = _this.y;

      _this.timer = setTimeout(function () {
        _this.compare(el, e);
      }, _this.options.interval);
    }
  };

  // Store the references to the passed-in values.
  this.element = element;
  this.onOverHandler = onOverHandler;
  this.onOutHandler = onOutHandler;
  this.options = _extends({}, defaultOptions, options);

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

  // Set up listeners.
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


// ---
// EVENT DISPATCHERS
// ---


// ---
// TRACKER
// ---


/**
 * Stores to the variables the XY positon within the application's client area
 * at which the event occurred.
 */


// ---
// TIMERS
// ---


; // end class
