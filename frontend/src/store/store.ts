import { createStore, combineReducers } from 'redux';
import dataReducer from './reducers/habitsReducer';

const rootReducer = combineReducers({
  data: dataReducer,
});

const store = createStore(rootReducer);

export default store;
