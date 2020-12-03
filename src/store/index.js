import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import user from './user';

const middlewares = [];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(createLogger());
}

const reducer = combineReducers({
  user,
});

const store = configureStore({ reducer, middleware: [...middlewares]});

export default store;
