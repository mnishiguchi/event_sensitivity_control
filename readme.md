# Event sensitivity control

In this repo, I will learn how [tristen/hoverintent](https://github.com/tristen/hoverintent/blob/gh-pages/index.js) works.


## Demo app

Install dependencies

```
npm install
```

Compile javascript

```
npm run build
```

Run the development server

```
npm run server
```

## Usage

setting up

```js
var element = document.querySelector('#controlled-element');

function onOverHandler() {
  // ...
}

function onOutHandler() {
  // ...
}

var options = {
  sensitivity: 7,   // in pixels
  interval   : 200, // in milliseconds
  timeout    : 400  // in milliseconds
};

var lister = new eventSensitivityControl(
  element,
  onOverHandler,
  onOutHandler,
  options
);
```

removing listener

```js
lister.remove();
```
