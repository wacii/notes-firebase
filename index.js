import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import InitializeFirebase from './src/initialize-firebase';
import App from './src/app';

// FIXME: center the content better, this is hideous
render(
  <div className="container columns">
    <div className="hide-xs column"></div>
    <div className="column">
      <InitializeFirebase>
        <App />
      </InitializeFirebase>
    </div>
    <div className="hide-xs column"></div>
  </div>,
  document.getElementById('app')
);
