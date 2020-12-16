import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './containers/App';
import { Provider } from 'react-redux';
import store from './store/index';
import { ToastProvider } from 'react-toast-notifications';

ReactDOM.render(
    <Provider store={store}>
      <Router>
        <ToastProvider>
          <App />
        </ToastProvider>
      </Router>
    </Provider>,
  document.getElementById('root'),
);
