import { createStore, combineReducers } from 'redux';
import habitReducer from './reducers/habitsReducer';
import entryReducer from './reducers/entryReducer';
import settingsReducer from './reducers/settingsReducer';

const rootReducer = combineReducers({
  habit: habitReducer,
  entry: entryReducer,
  settings: settingsReducer,
});

const store = createStore(rootReducer);

export default store;
