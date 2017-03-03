// CSS
import 'semantic-ui-css/semantic.css';
import './style.sass';

// JS
import 'whatwg-fetch';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

// COMPONENTS
import Root from './root';
console.log('hello');

render(
  <AppContainer>
    <Root />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./root', () => {
    const NextRoot = require('./root').default;
    render(
      <AppContainer>
        <NextRoot />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
