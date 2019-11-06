import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';

import notesReducer from './reducer';

const rootReducer = combineReducers({
  notes: notesReducer
});

const middlewares = [thunk];

const store = createStore(rootReducer, applyMiddleware(...middlewares))

export default store;