import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import { Provider } from 'react-redux';
import store from './store/index';
import { BrowserRouter as Router} from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Provider>
  </Router>,
  document.getElementById('root'),
);
