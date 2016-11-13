import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import InitializeFirebase from './src/initialize-firebase';
import App from './src/app';

render(
  <InitializeFirebase>
    <App />
  </InitializeFirebase>,
  document.getElementById('app')
);
