import { createStore, combineReducers } from 'redux';
import habitReducer from './reducers/habitsReducer';
import entryReducer from './reducers/entryReducer';

const rootReducer = combineReducers({
  habit: habitReducer,
  entry: entryReducer,
});

const store = createStore(rootReducer);

export default store;
