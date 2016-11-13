var jsdom = require('jsdom').jsdom;

global.document = jsdom('');
var window = document.defaultView;
global.window = window;

Object.keys(window).forEach(key => {
  if (typeof global[key] === 'undefined')
    global[key] = window[key];
});

global.navigator = { userAgent: 'node.js' };
