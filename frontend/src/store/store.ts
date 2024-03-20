import { createStore, combineReducers, compose } from 'redux';
import habitReducer from './reducers/habitsReducer';
import entryReducer from './reducers/entryReducer';
import settingsReducer from './reducers/settingsReducer';
import userReducer from './reducers/userReducer';

const rootReducer = combineReducers({
  habit: habitReducer,
  entry: entryReducer,
  settings: settingsReducer,
  user: userReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers());

export default store;
