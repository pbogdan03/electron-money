import React from 'react';

import './Core.sass';

const Core = ({ children }) => (
  <div className="ui container core-app">
    <div className="ui divider"></div>
    <main>
      { children }
    </main>
  </div>
);

export default Core;
