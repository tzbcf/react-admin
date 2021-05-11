import {combineReducers} from 'redux';
import testReducer from './test';
import { toggleCollapsed } from './common/collapsed';
import { langSwitch } from './common/language';


const mergeReucer = combineReducers({
  testReducer,
  toggleCollapsed,
  langSwitch
});

export default mergeReucer;