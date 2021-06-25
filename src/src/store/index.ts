import {combineReducers} from 'redux';
import { toggleCollapsed } from './common/collapsed'; // 控制左边侧边栏
import { langSwitch } from './common/language'; // 控制语言切换

const mergeReucer = combineReducers({
  toggleCollapsed,
  langSwitch
});

export default mergeReucer;