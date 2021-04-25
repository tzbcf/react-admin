import {combineReducers} from 'redux';
import testReducer from './test';
import {toggleCollapsed} from './common/collapsed'

const mergeReucer = combineReducers({
  testReducer,
  toggleCollapsed
});

export default mergeReucer;