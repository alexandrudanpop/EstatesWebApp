import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/app';

// App starting point 
render(<AppContainer><App /></AppContainer>, document.querySelector("#app"));

if (module && module.hot) {
  module.hot.accept('./components/app.js', () => {
    const App = require('./components/app.js').default;
    render(
      <AppContainer>
        <App />
      </AppContainer>,
      document.querySelector("#app")
    );
  });
}
