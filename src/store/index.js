import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import user from './user';
import stock from './stock';

const middlewares = [];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(createLogger());
}

const reducer = combineReducers({
  user,
  stock,
});

const store = configureStore({ reducer, middleware: [...middlewares]});

export default store;
